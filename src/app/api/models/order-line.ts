/* tslint:disable */
import { AuxItem } from './aux-item';
import { ComboItem } from './combo-item';
import { Order } from './order';
import { AuxilaryOrderLine } from './auxilary-order-line';
export interface OrderLine {
  auxItems?: Array<AuxItem>;
  combos?: Array<ComboItem>;
  id?: number;
  item?: string;
  order?: Order;
  pricePerUnit?: number;
  productId?: number;
  quantity?: number;
  requiedAuxilaries?: Array<AuxilaryOrderLine>;
  total?: number;
}
