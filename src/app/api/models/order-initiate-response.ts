/* tslint:disable */
import { CommandResource } from './command-resource';
import { Order } from './order';
export interface OrderInitiateResponse {
  commandResource?: CommandResource;
  order?: Order;
}
