/* tslint:disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration for Api services
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
	rootUrl: string = '//dev.ci2.divisosofttech.com:8070';
	//rootUrl: string = '//dev.ci2.divisosofttech.com:8071';
}

export interface ApiConfigurationInterface {
  rootUrl?: string;
}
