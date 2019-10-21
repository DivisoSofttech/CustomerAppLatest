/* tslint:disable */
import { AuxilaryLineItem } from './auxilary-line-item';
import { Brand } from './brand';
import { Category } from './category';
import { ComboLineItem } from './combo-line-item';
import { Discount } from './discount';
import { Label } from './label';
import { Location } from './location';
import { Manufacturer } from './manufacturer';
import { Supplier } from './supplier';
import { TaxCategory } from './tax-category';
import { UOM } from './uom';
export interface Product {
  auxilaryLineItems?: Array<AuxilaryLineItem>;
  brand?: Brand;
  buyPrice?: number;
  category?: Category;
  comboLineItems?: Array<ComboLineItem>;
  discount?: Discount;
  iDPcode?: string;
  id?: number;
  idpcode?: string;
  image?: string;
  imageContentType?: string;
  isActive?: boolean;
  isAuxilaryItem?: boolean;
  isServiceItem?: boolean;
  labels?: Array<Label>;
  location?: Location;
  manufacturer?: Manufacturer;
  maxQuantityLevel?: number;
  minQuantityLevel?: number;
  name?: string;
  reference?: string;
  sellingPrice?: number;
  showInCatalogue?: boolean;
  sku?: string;
  storageCost?: number;
  supplier?: Supplier;
  taxCategory?: TaxCategory;
  unit?: UOM;
}
