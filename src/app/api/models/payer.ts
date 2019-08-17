/* tslint:disable */
import { FundingInstrument } from './funding-instrument';
import { PayerInfo } from './payer-info';
export interface Payer {
  funding_instruments?: Array<FundingInstrument>;
  payer_info?: PayerInfo;
  payment_method?: string;
  status?: string;
}
