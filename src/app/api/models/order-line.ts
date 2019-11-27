/* tslint:disable */
import { AuxItem } from './aux-item';
import { ComboItem } from './combo-item';
import { AuxilaryOrderLine } from './auxilary-order-line';
export interface OrderLine {
  auxItems?: Array<AuxItem>;
  combos?: Array<ComboItem>;
  id?: number;
  item?: string;
  pricePerUnit?: number;
  productId?: number;
  quantity?: number;
  requiedAuxilaries?: Array<AuxilaryOrderLine>;
  state?: string;
  total?: number;
}
