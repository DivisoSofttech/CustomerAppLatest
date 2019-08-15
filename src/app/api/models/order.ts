/* tslint:disable */
import { Offer } from './offer';
import { DeliveryInfo } from './delivery-info';
import { ApprovalDetails } from './approval-details';
import { OrderLine } from './order-line';
import { Status } from './status';
export interface Order {
  grandTotal?: number;
  appliedOffers?: Array<Offer>;
  customerId?: string;
  date?: string;
  deliveryInfo?: DeliveryInfo;
  email?: string;
  approvalDetails?: ApprovalDetails;
  id?: number;
  orderId?: string;
  orderLines?: Array<OrderLine>;
  paymentRef?: string;
  status?: Status;
  storeId?: string;
}
