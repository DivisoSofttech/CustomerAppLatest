/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { OrderModel } from '../models/order-model';

/**
 * Offer Command Resource
 */
@Injectable({
  providedIn: 'root',
})
class OfferCommandResourceService extends __BaseService {
  static readonly checkOfferEligibilityUsingPOSTPath = '/api/claimOffer/{customerId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `OfferCommandResourceService.CheckOfferEligibilityUsingPOSTParams` containing the following parameters:
   *
   * - `orderModel`: orderModel
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  checkOfferEligibilityUsingPOSTResponse(params: OfferCommandResourceService.CheckOfferEligibilityUsingPOSTParams): __Observable<__StrictHttpResponse<OrderModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.orderModel;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/claimOffer/${params.customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OrderModel>;
      })
    );
  }
  /**
   * @param params The `OfferCommandResourceService.CheckOfferEligibilityUsingPOSTParams` containing the following parameters:
   *
   * - `orderModel`: orderModel
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  checkOfferEligibilityUsingPOST(params: OfferCommandResourceService.CheckOfferEligibilityUsingPOSTParams): __Observable<OrderModel> {
    return this.checkOfferEligibilityUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as OrderModel)
    );
  }
}

module OfferCommandResourceService {

  /**
   * Parameters for checkOfferEligibilityUsingPOST
   */
  export interface CheckOfferEligibilityUsingPOSTParams {

    /**
     * orderModel
     */
    orderModel: OrderModel;

    /**
     * customerId
     */
    customerId: string;
  }
}

export { OfferCommandResourceService }
