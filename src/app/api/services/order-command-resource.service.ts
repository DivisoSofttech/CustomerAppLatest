/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { AddressDTO } from '../models/address-dto';
import { DeliveryInfoDTO } from '../models/delivery-info-dto';
import { DeliveryInfo } from '../models/delivery-info';
import { NotificationDTO } from '../models/notification-dto';
import { Order } from '../models/order';
import { OrderInitiateResponse } from '../models/order-initiate-response';
import { PageOfAddress } from '../models/page-of-address';
import { CommandResource } from '../models/command-resource';

/**
 * Order Command Resource
 */
@Injectable({
  providedIn: 'root',
})
class OrderCommandResourceService extends __BaseService {
  static readonly updateAddressUsingPUTPath = '/api/command/addresses';
  static readonly deleteAddressUsingDELETEPath = '/api/command/addresses/{id}';
  static readonly deleteAuxilaryOrderLineUsingDELETEPath = '/api/command/auxilaries/{id}';
  static readonly editDeliveryInfoUsingPUTPath = '/api/command/delivery-info';
  static readonly updateNotificationUsingPUTPath = '/api/command/notifications';
  static readonly editOrderUsingPUTPath = '/api/command/order';
  static readonly initiateOrderUsingPOSTPath = '/api/command/order/initiateOrder';
  static readonly createAddressUsingPOSTPath = '/api/command/orders/addresses';
  static readonly getAllSavedAddressUsingGETPath = '/api/command/orders/addresses/{customerId}';
  static readonly collectDeliveryDetailsUsingPOSTPath = '/api/command/orders/collectDeliveryDetails/{taskId}/{orderId}';
  static readonly deleteOrderLineUsingDELETEPath = '/api/command/orders/{id}';
  static readonly sendUsingGETPath = '/api/command/sendMessage';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param addressDTO addressDTO
   * @return OK
   */
  updateAddressUsingPUTResponse(addressDTO: AddressDTO): __Observable<__StrictHttpResponse<AddressDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = addressDTO;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/command/addresses`,
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
  updateAddressUsingPUT(addressDTO: AddressDTO): __Observable<AddressDTO> {
    return this.updateAddressUsingPUTResponse(addressDTO).pipe(
      __map(_r => _r.body as AddressDTO)
    );
  }

  /**
   * @param id id
   */
  deleteAddressUsingDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/command/addresses/${id}`,
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
   * @param id id
   */
  deleteAddressUsingDELETE(id: number): __Observable<null> {
    return this.deleteAddressUsingDELETEResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param id id
   */
  deleteAuxilaryOrderLineUsingDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/command/auxilaries/${id}`,
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
   * @param id id
   */
  deleteAuxilaryOrderLineUsingDELETE(id: number): __Observable<null> {
    return this.deleteAuxilaryOrderLineUsingDELETEResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param deliveryInfo deliveryInfo
   * @return OK
   */
  editDeliveryInfoUsingPUTResponse(deliveryInfo: DeliveryInfo): __Observable<__StrictHttpResponse<DeliveryInfoDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = deliveryInfo;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/command/delivery-info`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DeliveryInfoDTO>;
      })
    );
  }
  /**
   * @param deliveryInfo deliveryInfo
   * @return OK
   */
  editDeliveryInfoUsingPUT(deliveryInfo: DeliveryInfo): __Observable<DeliveryInfoDTO> {
    return this.editDeliveryInfoUsingPUTResponse(deliveryInfo).pipe(
      __map(_r => _r.body as DeliveryInfoDTO)
    );
  }

  /**
   * @param notificationDTO notificationDTO
   * @return OK
   */
  updateNotificationUsingPUTResponse(notificationDTO: NotificationDTO): __Observable<__StrictHttpResponse<NotificationDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = notificationDTO;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/command/notifications`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<NotificationDTO>;
      })
    );
  }
  /**
   * @param notificationDTO notificationDTO
   * @return OK
   */
  updateNotificationUsingPUT(notificationDTO: NotificationDTO): __Observable<NotificationDTO> {
    return this.updateNotificationUsingPUTResponse(notificationDTO).pipe(
      __map(_r => _r.body as NotificationDTO)
    );
  }

  /**
   * @param order order
   * @return OK
   */
  editOrderUsingPUTResponse(order: Order): __Observable<__StrictHttpResponse<Order>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = order;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/command/order`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Order>;
      })
    );
  }
  /**
   * @param order order
   * @return OK
   */
  editOrderUsingPUT(order: Order): __Observable<Order> {
    return this.editOrderUsingPUTResponse(order).pipe(
      __map(_r => _r.body as Order)
    );
  }

  /**
   * @param order order
   * @return OK
   */
  initiateOrderUsingPOSTResponse(order: Order): __Observable<__StrictHttpResponse<OrderInitiateResponse>> {
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
        return _r as __StrictHttpResponse<OrderInitiateResponse>;
      })
    );
  }
  /**
   * @param order order
   * @return OK
   */
  initiateOrderUsingPOST(order: Order): __Observable<OrderInitiateResponse> {
    return this.initiateOrderUsingPOSTResponse(order).pipe(
      __map(_r => _r.body as OrderInitiateResponse)
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
   * @param id id
   */
  deleteOrderLineUsingDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/command/orders/${id}`,
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
   * @param id id
   */
  deleteOrderLineUsingDELETE(id: number): __Observable<null> {
    return this.deleteOrderLineUsingDELETEResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param name undefined
   * @return OK
   */
  sendUsingGETResponse(name?: string): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (name != null) __params = __params.set('name', name.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/command/sendMessage`,
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
   * @param name undefined
   * @return OK
   */
  sendUsingGET(name?: string): __Observable<string> {
    return this.sendUsingGETResponse(name).pipe(
      __map(_r => _r.body as string)
    );
  }
}

module OrderCommandResourceService {

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
    orderId: string;

    /**
     * deliveryInfo
     */
    deliveryInfo: DeliveryInfo;
  }
}

export { OrderCommandResourceService }
