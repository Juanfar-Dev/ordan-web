import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { NotificationService } from '../../shared/services/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private authService = inject(AuthService);
  private SupabaseClient = inject(SupabaseService).supabase;
  private notificationService = inject(NotificationService);

  async createInvoice(invoiceData: any | null): Promise<any> {
    try {
      const functionBody = {
        input_account_id: invoiceData?.account_id,
        input_submited_at: invoiceData?.submited_at,
        input_invoice_number: invoiceData?.invoice_number,
        input_rate: invoiceData?.rate,
        input_days: invoiceData?.days,
        input_iva_percent: invoiceData?.iva_percent,
        input_irpf_percent: invoiceData?.irpf_percent,
        input_subtotal: invoiceData?.subtotal,
        input_subtotal_with_iva: invoiceData?.subtotal_with_iva,
        input_irpf_amount: invoiceData?.irpf_amount,
        input_iva_amount: invoiceData?.iva_amount,
        input_total: invoiceData?.total,
        input_user_id: invoiceData.user_id,
        input_account_alias: invoiceData.account_alias,
      };

      // 1. Llamar a la función de base de datos usando RPC
      const { data: rpcData, error: rpcError } = await this.SupabaseClient.rpc(
        'create_invoice_with_uuid',
        functionBody
      );

      if (rpcError) {
        console.error('Error en la llamada RPC:', rpcError);
        throw rpcError;
      }
      return rpcData;
    } catch (error) {
      console.error('Error en el proceso de creación de factura:', error);
      this.notificationService.updateNotification(`<strong>Error al crear la factura:</strong> ${(error as { details: string }).details}`, 'error', 15000);
      throw error;
    }
  }

  async getInvoices() {
    try {
      const { data: { session } } = await this.authService.session();
      const { data, error } = await this.SupabaseClient
        .from('invoices')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      return null;
    }
  }

  async getInvoiceByIdShort(invoice_id_short: string) {
    try {
      const { data, error } = await this.SupabaseClient
        .from('invoices')
        .select('*')
        .eq('invoice_id_short', invoice_id_short)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener la factura por ID corto:', error);
      return null;
    }
  }

  async getInvoicesByAccountId(account_id: string) {
    try {
      const { data, error } = await this.SupabaseClient
        .from('invoices')
        .select('*')
        .eq('account_id', account_id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener facturas por account_id:', error);
      return null;
    }
  }

  now() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return {
      year,
      month,
      day,
    };
  }
}
