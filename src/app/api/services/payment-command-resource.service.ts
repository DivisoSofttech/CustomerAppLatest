/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { PaymentExecutionRequest } from '../models/payment-execution-request';
import { PaymentInitiateResponse } from '../models/payment-initiate-response';
import { PaymentInitiateRequest } from '../models/payment-initiate-request';
import { PaymentDTO } from '../models/payment-dto';
import { OrderResponse } from '../models/order-response';
import { OrderRequest } from '../models/order-request';

/**
 * Payment Command Resource
 */
@Injectable({
  providedIn: 'root',
})
class PaymentCommandResourceService extends __BaseService {
  static readonly createClientAuthTokenUsingGETPath = '/api/command/clientToken';
  static readonly executePaymentUsingPOSTPath = '/api/command/paypal/execute/{paymentId}';
  static readonly initiatePaymentUsingPOSTPath = '/api/command/paypal/initiate';
  static readonly processPaymentUsingPOSTPath = '/api/command/processPayment/{status}/{taskId}';
  static readonly createOrderUsingPOSTPath = '/api/command/razorpay/order';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @return OK
   */
  createClientAuthTokenUsingGETResponse(): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/command/clientToken`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }
  /**
   * @return OK
   */
  createClientAuthTokenUsingGET(): __Observable<string> {
    return this.createClientAuthTokenUsingGETResponse().pipe(
      __map(_r => _r.body as string)
    );
  }

  /**
   * @param params The `PaymentCommandResourceService.ExecutePaymentUsingPOSTParams` containing the following parameters:
   *
   * - `paymentId`: paymentId
   *
   * - `paymentExecutionRequest`: paymentExecutionRequest
   */
  executePaymentUsingPOSTResponse(params: PaymentCommandResourceService.ExecutePaymentUsingPOSTParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.paymentExecutionRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/paypal/execute/${params.paymentId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `PaymentCommandResourceService.ExecutePaymentUsingPOSTParams` containing the following parameters:
   *
   * - `paymentId`: paymentId
   *
   * - `paymentExecutionRequest`: paymentExecutionRequest
   */
  executePaymentUsingPOST(params: PaymentCommandResourceService.ExecutePaymentUsingPOSTParams): __Observable<null> {
    return this.executePaymentUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param paymentInitiateRequest paymentInitiateRequest
   * @return OK
   */
  initiatePaymentUsingPOSTResponse(paymentInitiateRequest: PaymentInitiateRequest): __Observable<__StrictHttpResponse<PaymentInitiateResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = paymentInitiateRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/paypal/initiate`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaymentInitiateResponse>;
      })
    );
  }
  /**
   * @param paymentInitiateRequest paymentInitiateRequest
   * @return OK
   */
  initiatePaymentUsingPOST(paymentInitiateRequest: PaymentInitiateRequest): __Observable<PaymentInitiateResponse> {
    return this.initiatePaymentUsingPOSTResponse(paymentInitiateRequest).pipe(
      __map(_r => _r.body as PaymentInitiateResponse)
    );
  }

  /**
   * @param params The `PaymentCommandResourceService.ProcessPaymentUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `status`: status
   *
   * - `paymentDTO`: paymentDTO
   *
   * @return OK
   */
  processPaymentUsingPOSTResponse(params: PaymentCommandResourceService.ProcessPaymentUsingPOSTParams): __Observable<__StrictHttpResponse<PaymentDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    __body = params.paymentDTO;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/processPayment/${params.status}/${params.taskId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaymentDTO>;
      })
    );
  }
  /**
   * @param params The `PaymentCommandResourceService.ProcessPaymentUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `status`: status
   *
   * - `paymentDTO`: paymentDTO
   *
   * @return OK
   */
  processPaymentUsingPOST(params: PaymentCommandResourceService.ProcessPaymentUsingPOSTParams): __Observable<PaymentDTO> {
    return this.processPaymentUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as PaymentDTO)
    );
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
      this.rootUrl + `/api/command/razorpay/order`,
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

  /**
   * Parameters for executePaymentUsingPOST
   */
  export interface ExecutePaymentUsingPOSTParams {

    /**
     * paymentId
     */
    paymentId: string;

    /**
     * paymentExecutionRequest
     */
    paymentExecutionRequest: PaymentExecutionRequest;
  }

  /**
   * Parameters for processPaymentUsingPOST
   */
  export interface ProcessPaymentUsingPOSTParams {

    /**
     * taskId
     */
    taskId: string;

    /**
     * status
     */
    status: string;

    /**
     * paymentDTO
     */
    paymentDTO: PaymentDTO;
  }
}

export { PaymentCommandResourceService }
