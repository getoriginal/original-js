export type AllocationParams = {
  amount: number;
  nonce: string;
  reward_uid: string;
  to_user_uid: string;
};

export type Allocation = {
  amount: number;
  created_at: string;
  nonce: string;
  reward_uid: string;
  status: string;
  to_user_uid: string;
  uid: string;
};
