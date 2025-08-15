export interface Account {
  account_id?: string;
  avatar?: string;
  name: string;
  status: boolean;
  last_invoice_date?: string;
  job_role?: string;
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
      status: true,
      last_invoice_date: '2023-05-01',
    },
    {
      account_id: '5B98B09A',
      avatar: 'https://api.midominio.com/avatar?name=Juan%20Perez',
      name: 'Account Two',
      status: false,
      last_invoice_date: '2023-05-01',
    },
    {
      account_id: '7CA71512',
      avatar: 'https://api.midominio.com/avatar?name=Juan%20Perez',
      name: 'Account Three',
      status: true,
      last_invoice_date: '2023-05-01',
    }
  ]
};
