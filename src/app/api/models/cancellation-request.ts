/* tslint:disable */
import { CancelledAuxilaryOrderLine } from './cancelled-auxilary-order-line';
import { CancelledOrderLine } from './cancelled-order-line';
import { RefundDetails } from './refund-details';
export interface CancellationRequest {
  amount?: number;
  cancelledAuxilaryOrderLines?: Array<CancelledAuxilaryOrderLine>;
  cancelledOrderLines?: Array<CancelledOrderLine>;
  customerEmail?: string;
  customerPhone?: number;
  date?: string;
  id?: number;
  orderId?: string;
  paymentId?: string;
  phoneCode?: number;
  reference?: string;
  refundDetails?: RefundDetails;
  status?: string;
  storeEmail?: string;
  storePhone?: number;
}
