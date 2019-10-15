/* tslint:disable */
import { Offer } from './offer';
import { ApprovalDetails } from './approval-details';
import { DeliveryInfo } from './delivery-info';
import { OrderLine } from './order-line';
import { Status } from './status';
export interface Order {
  appliedOffers?: Array<Offer>;
  approvalDetails?: ApprovalDetails;
  customerId?: string;
  date?: string;
  deliveryInfo?: DeliveryInfo;
  email?: string;
  grandTotal?: number;
  id?: number;
  orderId?: string;
  orderLines?: Array<OrderLine>;
  paymentRef?: string;
  status?: Status;
  storeId?: string;
}
