/* tslint:disable */
import { Amount } from './amount';
import { Payee } from './payee';
import { RelatedResources } from './related-resources';
export interface Transaction {
  amount?: Amount;
  description?: string;
  invoice_number?: string;
  note_to_payee?: string;
  payee?: Payee;
  related_resources?: Array<RelatedResources>;
}
