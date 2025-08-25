export interface Invoice {
  id: number;                 // bigint (ojo con > Number.MAX_SAFE_INTEGER si tu BD crece mucho)
  invoice_id: string;         // uuid
  created_at: string;         // timestamptz ISO (ej. "2025-08-23T10:12:34.000Z")
  updated_at: string;         // timestamptz ISO
  account_id: string;         // uuid
  account_alias: string;      // text
  user_id: string;            // uuid
  submited_at: string;        // date ISO (ej. "2025-08-23")
  due_at?: string;             // date ISO (ej. "2025-08-23")
  invoice_number: string;     // text
  rate: number;               // double precision
  days: number;               // double precision
  iva_percent: number;        // bigint
  irpf_percent: number;       // bigint
  iva_amount: number;         // double precision
  irpf_amount: number;        // double precision
  subtotal: number;           // double precision
  subtotal_with_iva?: number; // double precision
  total: number;              // double precision
}

export type NewInvoice = Omit<Invoice, 'id' | 'created_at' | 'updated_at'>;
