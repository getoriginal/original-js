export type TransferParams = {
  asset_uid: string;
  from_user_uid: string;
  to_address: string;
};

export type Transfer = {
  asset_uid: string;
  created_at: string;
  from_user_uid: string;
  status: string;
  to_address: string;
  uid: string;
};
