/* tslint:disable */
export interface PaymentDTO {
  provider?: string;
  amount?: number;
  id?: number;
  payee?: string;
  payer?: string;
  paymentType?: string;
  dateAndTime?: string;
  ref?: string;
  status?: string;
  targetId?: string;
  tax?: number;
  total?: number;
}
