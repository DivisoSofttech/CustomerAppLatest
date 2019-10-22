/* tslint:disable */
import { ApprovalDetails } from './approval-details';
import { DeliveryInfo } from './delivery-info';
import { Offer } from './offer';
import { OrderLine } from './order-line';
import { Status } from './status';
export interface Order {
  grandTotal?: number;
  allergy_note?: string;
  approvalDetails?: ApprovalDetails;
  customerId?: string;
  date?: string;
  deliveryInfo?: DeliveryInfo;
  email?: string;
  appliedOffers?: Array<Offer>;
  id?: number;
  orderId?: string;
  orderLines?: Array<OrderLine>;
  paymentRef?: string;
  pre_order_date?: string;
  status?: Status;
  storeId?: string;
}
