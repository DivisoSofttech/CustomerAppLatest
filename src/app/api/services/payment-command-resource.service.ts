/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { OrderResponse } from '../models/order-response';
import { OrderRequest } from '../models/order-request';

/**
 * Payment Command Resource
 */
@Injectable({
  providedIn: 'root',
})
class PaymentCommandResourceService extends __BaseService {
  static readonly createOrderUsingPOSTPath = '/api/payments/razorpay/order';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param orderRequest orderRequest
   * @return OK
   */
  createOrderUsingPOSTResponse(orderRequest: OrderRequest): __Observable<__StrictHttpResponse<OrderResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = orderRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/payments/razorpay/order`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OrderResponse>;
      })
    );
  }
  /**
   * @param orderRequest orderRequest
   * @return OK
   */
  createOrderUsingPOST(orderRequest: OrderRequest): __Observable<OrderResponse> {
    return this.createOrderUsingPOSTResponse(orderRequest).pipe(
      __map(_r => _r.body as OrderResponse)
    );
  }
}

module PaymentCommandResourceService {
}

export { PaymentCommandResourceService }
