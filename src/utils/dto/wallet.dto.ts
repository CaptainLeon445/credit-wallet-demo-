export interface FundDTO {
  userWalletId: number;
  amount: number;
}

export interface TransferFundDTO {
  senderWalletId: number;
  receiverWalletId: number;
  amount: number;
}

export interface WithdrawFundDTO {
  userWalletId: number;
  amount: number;
}
