/* tslint:disable */
export interface OrderResponse {
  amount?: number;
  amount_due?: number;
  amount_paid?: number;
  attempts?: number;
  created_at?: string;
  currency?: string;
  entity?: string;
  id?: string;
  notes?: Array<string>;
  offer_id?: string;
  receipt?: string;
  status?: string;
}
