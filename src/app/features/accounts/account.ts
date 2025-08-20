export interface Account {
  account_id?: string;
  account_id_short?: string;
  avatar?: string;
  name: string;
  alias: string;
  status: boolean;
  last_invoice_date?: string;
  job_role?: string;
  cif?: string;
  address?: string;
}
export interface AccountList {
  accounts: Account[];
}

export const mockAccounts: AccountList = {
  accounts: [
    {
      account_id_short: '01J8P3N6',
      avatar: '',
      name: 'Account One',
      alias: 'Cuenta de Juan1',
      status: true,
      last_invoice_date: '2023-05-01',
      job_role: 'Desarrollador Backend',
    },
    {
      account_id_short: '5B98B09A',
      avatar: '',
      name: 'Account Two',
      alias: 'Cuenta de Juan2',
      status: false,
      last_invoice_date: '2023-05-01',
      job_role: 'Desarrollador Backend',
    },
    {
      account_id_short: '7CA71512',
      avatar: '',
      name: 'Account Three',
      alias: 'Cuenta de Juan3',
      status: true,
      last_invoice_date: '2023-05-01',
      job_role: 'Desarrollador Backend',
    }
  ]
};
