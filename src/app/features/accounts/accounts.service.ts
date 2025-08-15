import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account, AccountList, mockAccounts } from './account';
import { Observable } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private http = inject(HttpClient);
  private supabase!: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  getMockAccounts(): AccountList {
    return {
      accounts: [...mockAccounts.accounts],
    };
  }

  getMockAccountById(accountId: string): Account | undefined {
    return mockAccounts.accounts.find(
      (account) => account.account_id === accountId
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
      const { data, error } = await this.supabase
        .from('accounts') // Selecciona la tabla
        .select('*'); // Selecciona todas las columnas

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener las cuentas:', error);
      return null;
    }
  }

  async createAccount(avatarFile: File, accountData: any): Promise<any> {
    try {
      // 1. Subir la imagen al bucket de Supabase Storage
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `stg_ordan_avatars/${fileName}`; // Ruta del archivo en el bucket

      const { error: uploadError } = await this.supabase.storage
        .from('avatars') // Reemplaza 'avatars' con el nombre de tu bucket
        .upload(filePath, avatarFile);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Obtener la URL pública de la imagen
      const { data: publicUrlData } = this.supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      // 3. Preparar los datos para la llamada RPC
      const functionBody = {
        input_avatar: avatarUrl, // Usar la URL de la imagen
        input_status: accountData.input_status,
        input_name: accountData.input_name,
        input_job_role: accountData.input_job_role,
      };

      // 4. Llamar a la función de base de datos usando RPC
      const { data: rpcData, error: rpcError } = await this.supabase.rpc(
        'create_account_with_uuid',
        functionBody
      );

      if (rpcError) {
        throw rpcError;
      }

      console.log('Cuenta creada con éxito:', rpcData);
      return rpcData;
    } catch (error) {
      console.error('Error en el proceso de creación de cuenta:', error);
      throw error;
    }
  }
}
