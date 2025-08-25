import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private authService = inject(AuthService);
  private SupabaseClient = inject(SupabaseService).supabase;

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
      throw error;
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
