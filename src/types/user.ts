export type UserParams = {
  email?: string;
  user_external_id?: string;
};

export type UserWallet = {
  address: string;
  explorer_url: string;
  network: string;
  chain_id?: number;
};

export type User = {
  created_at: string;
  uid: string;
  wallets: UserWallet[];
  email?: string;
  user_external_id?: string;
};
