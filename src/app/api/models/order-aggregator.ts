/* tslint:disable */
import { AuxItem } from './aux-item';
import { ComboItem } from './combo-item';
import { OrderLine } from './order-line';
import { OrderMaster } from './order-master';
export interface OrderAggregator {
  auxitem?: Array<AuxItem>;
  comboItem?: Array<ComboItem>;
  orderLine?: Array<OrderLine>;
  orderMaster?: OrderMaster;
}
