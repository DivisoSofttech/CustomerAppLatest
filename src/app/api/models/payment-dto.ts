/* tslint:disable */
export interface PaymentDTO {
  amount?: number;
  dateAndTime?: string;
  id?: number;
  payee?: string;
  payer?: string;
  paymentType?: string;
  provider?: string;
  ref?: string;
  status?: string;
  targetId?: string;
  tax?: number;
  total?: number;
}
