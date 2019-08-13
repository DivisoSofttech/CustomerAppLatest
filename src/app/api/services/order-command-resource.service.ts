/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CommandResource } from '../models/command-resource';
import { AcceptOrderRequest } from '../models/accept-order-request';
import { Order } from '../models/order';
import { AddressDTO } from '../models/address-dto';
import { PageOfAddress } from '../models/page-of-address';
import { DeliveryInfo } from '../models/delivery-info';
import { ProcessPaymentRequest } from '../models/process-payment-request';

/**
 * Order Command Resource
 */
@Injectable({
  providedIn: 'root',
})
class OrderCommandResourceService extends __BaseService {
  static readonly acceptOrderUsingPOSTPath = '/api/command/acceptOrder';
  static readonly initiateOrderUsingPOSTPath = '/api/command/order/initiateOrder';
  static readonly createAddressUsingPOSTPath = '/api/command/orders/addresses';
  static readonly getAllSavedAddressUsingGETPath = '/api/command/orders/addresses/{customerId}';
  static readonly collectDeliveryDetailsUsingPOSTPath = '/api/command/orders/collectDeliveryDetails/{taskId}/{orderId}';
  static readonly getProcessPaymentUsingPOSTPath = '/api/command/process-payment';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param acceptOrderRequest acceptOrderRequest
   * @return OK
   */
  acceptOrderUsingPOSTResponse(acceptOrderRequest: AcceptOrderRequest): __Observable<__StrictHttpResponse<CommandResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = acceptOrderRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/acceptOrder`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandResource>;
      })
    );
  }
  /**
   * @param acceptOrderRequest acceptOrderRequest
   * @return OK
   */
  acceptOrderUsingPOST(acceptOrderRequest: AcceptOrderRequest): __Observable<CommandResource> {
    return this.acceptOrderUsingPOSTResponse(acceptOrderRequest).pipe(
      __map(_r => _r.body as CommandResource)
    );
  }

  /**
   * @param order order
   * @return OK
   */
  initiateOrderUsingPOSTResponse(order: Order): __Observable<__StrictHttpResponse<CommandResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = order;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/order/initiateOrder`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandResource>;
      })
    );
  }
  /**
   * @param order order
   * @return OK
   */
  initiateOrderUsingPOST(order: Order): __Observable<CommandResource> {
    return this.initiateOrderUsingPOSTResponse(order).pipe(
      __map(_r => _r.body as CommandResource)
    );
  }

  /**
   * @param params The `OrderCommandResourceService.CreateAddressUsingPOSTParams` containing the following parameters:
   *
   * - `state`:
   *
   * - `roadNameAreaOrStreet`:
   *
   * - `pincode`:
   *
   * - `phone`:
   *
   * - `name`:
   *
   * - `landmark`:
   *
   * - `id`:
   *
   * - `houseNoOrBuildingName`:
   *
   * - `customerId`:
   *
   * - `city`:
   *
   * - `alternatePhone`:
   *
   * - `addressType`:
   *
   * @return OK
   */
  createAddressUsingPOSTResponse(params: OrderCommandResourceService.CreateAddressUsingPOSTParams): __Observable<__StrictHttpResponse<AddressDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.state != null) __params = __params.set('state', params.state.toString());
    if (params.roadNameAreaOrStreet != null) __params = __params.set('roadNameAreaOrStreet', params.roadNameAreaOrStreet.toString());
    if (params.pincode != null) __params = __params.set('pincode', params.pincode.toString());
    if (params.phone != null) __params = __params.set('phone', params.phone.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.landmark != null) __params = __params.set('landmark', params.landmark.toString());
    if (params.id != null) __params = __params.set('id', params.id.toString());
    if (params.houseNoOrBuildingName != null) __params = __params.set('houseNoOrBuildingName', params.houseNoOrBuildingName.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.city != null) __params = __params.set('city', params.city.toString());
    if (params.alternatePhone != null) __params = __params.set('alternatePhone', params.alternatePhone.toString());
    if (params.addressType != null) __params = __params.set('addressType', params.addressType.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/orders/addresses`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AddressDTO>;
      })
    );
  }
  /**
   * @param params The `OrderCommandResourceService.CreateAddressUsingPOSTParams` containing the following parameters:
   *
   * - `state`:
   *
   * - `roadNameAreaOrStreet`:
   *
   * - `pincode`:
   *
   * - `phone`:
   *
   * - `name`:
   *
   * - `landmark`:
   *
   * - `id`:
   *
   * - `houseNoOrBuildingName`:
   *
   * - `customerId`:
   *
   * - `city`:
   *
   * - `alternatePhone`:
   *
   * - `addressType`:
   *
   * @return OK
   */
  createAddressUsingPOST(params: OrderCommandResourceService.CreateAddressUsingPOSTParams): __Observable<AddressDTO> {
    return this.createAddressUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as AddressDTO)
    );
  }

  /**
   * @param params The `OrderCommandResourceService.GetAllSavedAddressUsingGETParams` containing the following parameters:
   *
   * - `customerId`: customerId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  getAllSavedAddressUsingGETResponse(params: OrderCommandResourceService.GetAllSavedAddressUsingGETParams): __Observable<__StrictHttpResponse<PageOfAddress>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/command/orders/addresses/${params.customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfAddress>;
      })
    );
  }
  /**
   * @param params The `OrderCommandResourceService.GetAllSavedAddressUsingGETParams` containing the following parameters:
   *
   * - `customerId`: customerId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  getAllSavedAddressUsingGET(params: OrderCommandResourceService.GetAllSavedAddressUsingGETParams): __Observable<PageOfAddress> {
    return this.getAllSavedAddressUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfAddress)
    );
  }

  /**
   * @param params The `OrderCommandResourceService.CollectDeliveryDetailsUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `orderId`: orderId
   *
   * - `deliveryInfo`: deliveryInfo
   *
   * @return OK
   */
  collectDeliveryDetailsUsingPOSTResponse(params: OrderCommandResourceService.CollectDeliveryDetailsUsingPOSTParams): __Observable<__StrictHttpResponse<CommandResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    __body = params.deliveryInfo;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/orders/collectDeliveryDetails/${params.taskId}/${params.orderId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandResource>;
      })
    );
  }
  /**
   * @param params The `OrderCommandResourceService.CollectDeliveryDetailsUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `orderId`: orderId
   *
   * - `deliveryInfo`: deliveryInfo
   *
   * @return OK
   */
  collectDeliveryDetailsUsingPOST(params: OrderCommandResourceService.CollectDeliveryDetailsUsingPOSTParams): __Observable<CommandResource> {
    return this.collectDeliveryDetailsUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as CommandResource)
    );
  }

  /**
   * @param processPaymentRequest processPaymentRequest
   * @return OK
   */
  getProcessPaymentUsingPOSTResponse(processPaymentRequest: ProcessPaymentRequest): __Observable<__StrictHttpResponse<CommandResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = processPaymentRequest;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/process-payment`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandResource>;
      })
    );
  }
  /**
   * @param processPaymentRequest processPaymentRequest
   * @return OK
   */
  getProcessPaymentUsingPOST(processPaymentRequest: ProcessPaymentRequest): __Observable<CommandResource> {
    return this.getProcessPaymentUsingPOSTResponse(processPaymentRequest).pipe(
      __map(_r => _r.body as CommandResource)
    );
  }
}

module OrderCommandResourceService {

  /**
   * Parameters for createAddressUsingPOST
   */
  export interface CreateAddressUsingPOSTParams {
    state?: string;
    roadNameAreaOrStreet?: string;
    pincode?: number;
    phone?: number;
    name?: string;
    landmark?: string;
    id?: number;
    houseNoOrBuildingName?: string;
    customerId?: string;
    city?: string;
    alternatePhone?: number;
    addressType?: string;
  }

  /**
   * Parameters for getAllSavedAddressUsingGET
   */
  export interface GetAllSavedAddressUsingGETParams {

    /**
     * customerId
     */
    customerId: string;

    /**
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;

    /**
     * Size of a page
     */
    size?: number;

    /**
     * Page number of the requested page
     */
    page?: number;
  }

  /**
   * Parameters for collectDeliveryDetailsUsingPOST
   */
  export interface CollectDeliveryDetailsUsingPOSTParams {

    /**
     * taskId
     */
    taskId: string;

    /**
     * orderId
     */
    orderId: number;

    /**
     * deliveryInfo
     */
    deliveryInfo: DeliveryInfo;
  }
}

export { OrderCommandResourceService }
