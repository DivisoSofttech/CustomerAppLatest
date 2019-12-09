/* tslint:disable */
import { ResultBucket } from './result-bucket';
import { Sort } from './sort';
export interface PageOfResultBucket {
  content?: Array<ResultBucket>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
