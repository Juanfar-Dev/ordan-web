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
      account_id: '01J8P3N6',
      avatar: 'https://api.midominio.com/avatar?name=Juan%20Perez',
      name: 'Account One',
      alias: 'Cuenta de Juan1',
      status: true,
      last_invoice_date: '2023-05-01',
      job_role: 'Desarrollador Backend',
    },
    {
      account_id: '5B98B09A',
      avatar: 'https://api.midominio.com/avatar?name=Juan%20Perez',
      name: 'Account Two',
      alias: 'Cuenta de Juan2',
      status: false,
      last_invoice_date: '2023-05-01',
      job_role: 'Desarrollador Backend',
    },
    {
      account_id: '7CA71512',
      avatar: 'https://api.midominio.com/avatar?name=Juan%20Perez',
      name: 'Account Three',
      alias: 'Cuenta de Juan3',
      status: true,
      last_invoice_date: '2023-05-01',
      job_role: 'Desarrollador Backend',
    }
  ]
};
