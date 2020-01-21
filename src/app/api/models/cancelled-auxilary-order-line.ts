/* tslint:disable */
import { CancellationRequest } from './cancellation-request';
export interface CancelledAuxilaryOrderLine {
  ammount?: number;
  cancellationRequest?: CancellationRequest;
  id?: number;
  itemName?: string;
  orderLineId?: number;
  pricePerUnit?: number;
  productId?: number;
  quantity?: number;
}
