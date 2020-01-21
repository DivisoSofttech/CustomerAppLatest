/* tslint:disable */
import { Offer } from './offer';
import { ApprovalDetails } from './approval-details';
import { DeliveryInfo } from './delivery-info';
import { OrderLine } from './order-line';
import { Status } from './status';
export interface Order {
  acceptOrderId?: string;
  allergyNote?: string;
  appliedOffers?: Array<Offer>;
  approvalDetails?: ApprovalDetails;
  cancellationRef?: number;
  customerId?: string;
  date?: string;
  deliveryInfo?: DeliveryInfo;
  email?: string;
  grandTotal?: number;
  id?: number;
  orderId?: string;
  orderLines?: Array<OrderLine>;
  paymentMode?: string;
  paymentRef?: string;
  preOrderDate?: string;
  processId?: string;
  state?: string;
  status?: Status;
  storeId?: string;
  subTotal?: number;
  timeZone?: string;
}
