/* tslint:disable */
import { FavouriteStore } from './favourite-store';
import { Sort } from './sort';
export interface PageOfFavouriteStore {
  content?: Array<FavouriteStore>;
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
