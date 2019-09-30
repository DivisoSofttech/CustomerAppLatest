/* tslint:disable */
import { FavouriteProduct } from './favourite-product';
import { Sort } from './sort';
export interface PageOfFavouriteProduct {
  content?: Array<FavouriteProduct>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
