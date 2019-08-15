/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CommandResource } from '../models/command-resource';
import { ApprovalDetailsDTO } from '../models/approval-details-dto';
import { Order } from '../models/order';
import { AddressDTO } from '../models/address-dto';
import { PageOfAddress } from '../models/page-of-address';
import { DeliveryInfo } from '../models/delivery-info';
import { OrderDTO } from '../models/order-dto';

/**
 * Order Command Resource
 */
@Injectable({
  providedIn: 'root',
})
class OrderCommandResourceService extends __BaseService {
  static readonly acceptOrderUsingPOSTPath = '/api/command/acceptOrder/{taskId}';
  static readonly initiateOrderUsingPOSTPath = '/api/command/order/initiateOrder';
  static readonly createAddressUsingPOSTPath = '/api/command/orders/addresses';
  static readonly getAllSavedAddressUsingGETPath = '/api/command/orders/addresses/{customerId}';
  static readonly collectDeliveryDetailsUsingPOSTPath = '/api/command/orders/collectDeliveryDetails/{taskId}/{orderId}';
  static readonly updateOrderUsingPUTPath = '/api/command/updateOrder';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `OrderCommandResourceService.AcceptOrderUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `approvalDetailsDTO`: approvalDetailsDTO
   *
   * @return OK
   */
  acceptOrderUsingPOSTResponse(params: OrderCommandResourceService.AcceptOrderUsingPOSTParams): __Observable<__StrictHttpResponse<CommandResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.approvalDetailsDTO;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/acceptOrder/${params.taskId}`,
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
   * @param params The `OrderCommandResourceService.AcceptOrderUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `approvalDetailsDTO`: approvalDetailsDTO
   *
   * @return OK
   */
  acceptOrderUsingPOST(params: OrderCommandResourceService.AcceptOrderUsingPOSTParams): __Observable<CommandResource> {
    return this.acceptOrderUsingPOSTResponse(params).pipe(
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
   * @param addressDTO addressDTO
   * @return OK
   */
  createAddressUsingPOSTResponse(addressDTO: AddressDTO): __Observable<__StrictHttpResponse<AddressDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = addressDTO;
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
   * @param addressDTO addressDTO
   * @return OK
   */
  createAddressUsingPOST(addressDTO: AddressDTO): __Observable<AddressDTO> {
    return this.createAddressUsingPOSTResponse(addressDTO).pipe(
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
   * @param orderDTO orderDTO
   * @return OK
   */
  updateOrderUsingPUTResponse(orderDTO: OrderDTO): __Observable<__StrictHttpResponse<OrderDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = orderDTO;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/command/updateOrder`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OrderDTO>;
      })
    );
  }
  /**
   * @param orderDTO orderDTO
   * @return OK
   */
  updateOrderUsingPUT(orderDTO: OrderDTO): __Observable<OrderDTO> {
    return this.updateOrderUsingPUTResponse(orderDTO).pipe(
      __map(_r => _r.body as OrderDTO)
    );
  }
}

module OrderCommandResourceService {

  /**
   * Parameters for acceptOrderUsingPOST
   */
  export interface AcceptOrderUsingPOSTParams {

    /**
     * taskId
     */
    taskId: string;

    /**
     * approvalDetailsDTO
     */
    approvalDetailsDTO: ApprovalDetailsDTO;
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
