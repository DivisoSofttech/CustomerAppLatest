/* tslint:disable */
import { Offer } from './offer';
import { ApprovalDetails } from './approval-details';
import { DeliveryInfo } from './delivery-info';
import { OrderLine } from './order-line';
import { Status } from './status';
export interface Order {
  allergy_note?: string;
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
  pre_order_date?: string;
  status?: Status;
  storeId?: string;
}
