/* tslint:disable */
import { Links } from './links';
export interface HyperSchema {
  contentEncoding?: string;
  fragmentResolution?: string;
  links?: Array<Links>;
  mediaType?: string;
  pathStart?: string;
  readonly?: boolean;
}
