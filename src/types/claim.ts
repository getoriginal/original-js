export type ClaimParams = {
  from_user_uid: string;
  reward_uid: string;
  to_address: string;
};

export type Claim = {
  amount: number;
  created_at: string;
  from_user_uid: string;
  reward_uid: string;
  status: string;
  to_address: string;
  uid: string;
};
