/* tslint:disable */
export interface OrderResponse {
  entity?: string;
  amount?: number;
  amount_paid?: number;
  attempts?: number;
  created_at?: string;
  currency?: string;
  amount_due?: number;
  id?: string;
  notes?: Array<string>;
  offer_id?: string;
  receipt?: string;
  status?: string;
}
