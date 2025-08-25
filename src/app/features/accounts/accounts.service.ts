import { inject, Injectable } from '@angular/core';
import { Account, mockAccounts } from './account';
import { of } from 'rxjs';
import { SupabaseService } from '../../core/services/supabase.service';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private SupabaseClient = inject(SupabaseService).supabase;
  private authService = inject(AuthService);

  getMockAccounts() {
    return of([...mockAccounts.accounts]);
  }

  getMockAccountById(accountId: string) {
    return of(
      mockAccounts.accounts.find((account) => account.account_id === accountId)
    );
  }

  createMockAccount(account: Account): Account {
    const newAccount = {
      ...account,
      account_id: (Math.random() * 1000000).toString(),
    };
    mockAccounts.accounts.push(newAccount);
    return newAccount;
  }

  updateMockAccount(accountId: string, account: Account): Account | undefined {
    const index = mockAccounts.accounts.findIndex(
      (acc) => acc.account_id === accountId
    );
    if (index !== -1) {
      mockAccounts.accounts[index] = {
        ...mockAccounts.accounts[index],
        ...account,
      };
      return mockAccounts.accounts[index];
    }
    return undefined;
  }

  deleteMockAccount(accountId: string): boolean {
    const index = mockAccounts.accounts.findIndex(
      (acc) => acc.account_id === accountId
    );
    if (index !== -1) {
      mockAccounts.accounts.splice(index, 1);
      return true;
    }
    return false;
  }

  // Método para obtener todos los registros de la tabla 'accounts'
  async getAccounts(): Promise<any[] | null> {
    try {
      const { data: { session } } = await this.authService.session();
      const { data, error } = await this.SupabaseClient
        .from('accounts')
        .select('*')
        .eq('user_id', session?.user.id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener las cuentas:', error);
      return null;
    }
  }

  async createAccount(accountData: any, avatarFile: File | null): Promise<any> {
    const { data: { session } } = await this.authService.session();
    try {
      // 1. Subir la imagen al bucket de Supabase Storage
      let avatarUrl = null;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `accounts/${fileName}`;

        const { error: uploadError } = await this.SupabaseClient.storage
          .from('stg_ordan_avatars')
          .upload(filePath, avatarFile);

        if (uploadError) {
          throw uploadError;
        }

        // 2. Obtener la URL pública de la imagen
        const { data: publicUrlData } = this.SupabaseClient.storage
          .from('stg_ordan_avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      // 3. Preparar los datos para la llamada RPC
      const functionBody = {
        input_avatar: avatarUrl,
        input_status:
          accountData.status &&
          (accountData.status === 'false' || accountData.status === false)
            ? false
            : true,
        input_name: accountData.name,
        input_alias: accountData.alias,
        input_job_role: accountData.role,
        input_address: accountData.address,
        input_phone: accountData.phone,
        input_cif: accountData.cif,
        input_user_id: session?.user.id
      };

      // 4. Llamar a la función de base de datos usando RPC
      const { data: rpcData, error: rpcError } = await this.SupabaseClient.rpc(
        'create_account_with_uuid',
        functionBody
      );

      if (rpcError) {
        console.error('Error en la llamada RPC:', rpcError);
        throw rpcError;
      }
      return rpcData;
    } catch (error) {
      console.error('Error en el proceso de creación de cuenta:', error);
      throw error;
    }
  }

  async getAccountById(accountId: string): Promise<any | null> {
    try {
      const { data, error } = await this.SupabaseClient
        .from('accounts')
        .select('*')
        .eq('account_id', accountId);

      if (error) {
        console.error('Error al obtener la cuenta por ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener la cuenta por ID:', error);
      return null;
    }
  }

  async getAccountByUserId(): Promise<any | null> {
    try {
      const { data: { session } } = await this.authService.session();
      const { data, error } = await this.SupabaseClient
        .from('accounts')
        .select('*')
        .eq('user_id', session?.user.id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener la cuenta por ID de usuario:', error);
      return null;
    }
  }
}
