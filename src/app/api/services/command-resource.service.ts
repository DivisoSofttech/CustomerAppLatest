/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { AddressDTO } from '../models/address-dto';
import { OrderModel } from '../models/order-model';
import { ContactDTO } from '../models/contact-dto';
import { OTPChallenge } from '../models/otpchallenge';
import { OTPResponse } from '../models/otpresponse';
import { CustomerDTO } from '../models/customer-dto';
import { CustomerAggregator } from '../models/customer-aggregator';
import { DeliveryInfoDTO } from '../models/delivery-info-dto';
import { DeliveryInfo } from '../models/delivery-info';
import { FavouriteProductDTO } from '../models/favourite-product-dto';
import { FavouriteStoreDTO } from '../models/favourite-store-dto';
import { NotificationDTO } from '../models/notification-dto';
import { Order } from '../models/order';
import { OrderInitiateResponse } from '../models/order-initiate-response';
import { CommandResource } from '../models/command-resource';
import { PaymentExecutionRequest } from '../models/payment-execution-request';
import { PaymentInitiateResponse } from '../models/payment-initiate-response';
import { PaymentInitiateRequest } from '../models/payment-initiate-request';
import { PaymentDTO } from '../models/payment-dto';
import { OrderResponse } from '../models/order-response';
import { OrderRequest } from '../models/order-request';
import { ReplyDTO } from '../models/reply-dto';
import { PaymentTransactionResponse } from '../models/payment-transaction-response';
import { PaymentTransaction } from '../models/payment-transaction';
import { UserRatingReviewDTO } from '../models/user-rating-review-dto';

/**
 * Command Resource
 */
@Injectable({
  providedIn: 'root',
})
class CommandResourceService extends __BaseService {
  static readonly updateAddressUsingPUTPath = '/api/command/addresses';
  static readonly deleteAddressUsingDELETEPath = '/api/command/addresses/{id}';
  static readonly deleteAuxilaryOrderLineUsingDELETEPath = '/api/command/auxilaries/{id}';
  static readonly checkOfferEligibilityUsingPOSTPath = '/api/command/claimOffer/{customerId}';
  static readonly createClientAuthTokenUsingGETPath = '/api/command/clientToken';
  static readonly updateContactUsingPUTPath = '/api/command/contacts';
  static readonly deleteContactUsingDELETEPath = '/api/command/contacts/{id}';
  static readonly verifyOTPUsingPOSTPath = '/api/command/customer/otp_challenge';
  static readonly sendSMSUsingPOSTPath = '/api/command/customer/otp_send';
  static readonly updateCustomerUsingPUTPath = '/api/command/customers';
  static readonly createCustomerUsingPOSTPath = '/api/command/customers/register-customer';
  static readonly deleteCustomerUsingDELETEPath = '/api/command/customers/{id}';
  static readonly editDeliveryInfoUsingPUTPath = '/api/command/delivery-info';
  static readonly createFavouriteProductUsingPOSTPath = '/api/command/favouriteproduct';
  static readonly deleteFavouriteProductUsingDELETEPath = '/api/command/favouriteproduct/{id}';
  static readonly createFavouriteStoreUsingPOSTPath = '/api/command/favouritestore';
  static readonly deleteFavouriteStoreUsingDELETEPath = '/api/command/favouritestore/{id}';
  static readonly updateNotificationUsingPUTPath = '/api/command/notifications';
  static readonly editOrderUsingPUTPath = '/api/command/order';
  static readonly initiateOrderUsingPOSTPath = '/api/command/order/initiateOrder';
  static readonly createAddressUsingPOSTPath = '/api/command/orders/addresses';
  static readonly collectDeliveryDetailsUsingPOSTPath = '/api/command/orders/collectDeliveryDetails/{taskId}/{orderId}';
  static readonly deleteOrderLineUsingDELETEPath = '/api/command/orders/{id}';
  static readonly executePaymentUsingPOSTPath = '/api/command/paypal/execute/{paymentId}';
  static readonly initiatePaymentUsingPOSTPath = '/api/command/paypal/initiate';
  static readonly processPaymentUsingPOSTPath = '/api/command/processPayment/{status}/{taskId}';
  static readonly createOrderUsingPOSTPath = '/api/command/razorpay/order';
  static readonly createReplyUsingPOSTPath = '/api/command/replies';
  static readonly updateReplyUsingPUTPath = '/api/command/replies';
  static readonly deleteReplyUsingDELETEPath = '/api/command/replies/{id}';
  static readonly createTransactionUsingPOSTPath = '/api/command/transaction';
  static readonly updateLoyaltyPointUsingPOSTPath = '/api/command/updateLoyaltyPoint/{idpCode}/{point}/{orderId}';
  static readonly createUserRatingReviewUsingPOSTPath = '/api/command/user-rating-review';

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
   * @param params The `CommandResourceService.CheckOfferEligibilityUsingPOSTParams` containing the following parameters:
   *
   * - `orderModel`: orderModel
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  checkOfferEligibilityUsingPOSTResponse(params: CommandResourceService.CheckOfferEligibilityUsingPOSTParams): __Observable<__StrictHttpResponse<OrderModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.orderModel;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/claimOffer/${params.customerId}`,
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
   * @param params The `CommandResourceService.CheckOfferEligibilityUsingPOSTParams` containing the following parameters:
   *
   * - `orderModel`: orderModel
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  checkOfferEligibilityUsingPOST(params: CommandResourceService.CheckOfferEligibilityUsingPOSTParams): __Observable<OrderModel> {
    return this.checkOfferEligibilityUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as OrderModel)
    );
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
   * @param contact contact
   * @return OK
   */
  updateContactUsingPUTResponse(contact: ContactDTO): __Observable<__StrictHttpResponse<ContactDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = contact;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/command/contacts`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ContactDTO>;
      })
    );
  }
  /**
   * @param contact contact
   * @return OK
   */
  updateContactUsingPUT(contact: ContactDTO): __Observable<ContactDTO> {
    return this.updateContactUsingPUTResponse(contact).pipe(
      __map(_r => _r.body as ContactDTO)
    );
  }

  /**
   * @param id id
   */
  deleteContactUsingDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/command/contacts/${id}`,
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
  deleteContactUsingDELETE(id: number): __Observable<null> {
    return this.deleteContactUsingDELETEResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param params The `CommandResourceService.VerifyOTPUsingPOSTParams` containing the following parameters:
   *
   * - `numbers`: numbers
   *
   * - `code`: code
   *
   * @return OK
   */
  verifyOTPUsingPOSTResponse(params: CommandResourceService.VerifyOTPUsingPOSTParams): __Observable<__StrictHttpResponse<OTPChallenge>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.numbers != null) __params = __params.set('numbers', params.numbers.toString());
    if (params.code != null) __params = __params.set('code', params.code.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/customer/otp_challenge`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OTPChallenge>;
      })
    );
  }
  /**
   * @param params The `CommandResourceService.VerifyOTPUsingPOSTParams` containing the following parameters:
   *
   * - `numbers`: numbers
   *
   * - `code`: code
   *
   * @return OK
   */
  verifyOTPUsingPOST(params: CommandResourceService.VerifyOTPUsingPOSTParams): __Observable<OTPChallenge> {
    return this.verifyOTPUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as OTPChallenge)
    );
  }

  /**
   * @param numbers numbers
   * @return OK
   */
  sendSMSUsingPOSTResponse(numbers: number): __Observable<__StrictHttpResponse<OTPResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (numbers != null) __params = __params.set('numbers', numbers.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/customer/otp_send`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OTPResponse>;
      })
    );
  }
  /**
   * @param numbers numbers
   * @return OK
   */
  sendSMSUsingPOST(numbers: number): __Observable<OTPResponse> {
    return this.sendSMSUsingPOSTResponse(numbers).pipe(
      __map(_r => _r.body as OTPResponse)
    );
  }

  /**
   * @param customerDTO customerDTO
   * @return OK
   */
  updateCustomerUsingPUTResponse(customerDTO: CustomerDTO): __Observable<__StrictHttpResponse<CustomerDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = customerDTO;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/command/customers`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CustomerDTO>;
      })
    );
  }
  /**
   * @param customerDTO customerDTO
   * @return OK
   */
  updateCustomerUsingPUT(customerDTO: CustomerDTO): __Observable<CustomerDTO> {
    return this.updateCustomerUsingPUTResponse(customerDTO).pipe(
      __map(_r => _r.body as CustomerDTO)
    );
  }

  /**
   * @param customerAggregator customerAggregator
   * @return OK
   */
  createCustomerUsingPOSTResponse(customerAggregator: CustomerAggregator): __Observable<__StrictHttpResponse<CustomerDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = customerAggregator;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/customers/register-customer`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CustomerDTO>;
      })
    );
  }
  /**
   * @param customerAggregator customerAggregator
   * @return OK
   */
  createCustomerUsingPOST(customerAggregator: CustomerAggregator): __Observable<CustomerDTO> {
    return this.createCustomerUsingPOSTResponse(customerAggregator).pipe(
      __map(_r => _r.body as CustomerDTO)
    );
  }

  /**
   * @param id id
   */
  deleteCustomerUsingDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/command/customers/${id}`,
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
  deleteCustomerUsingDELETE(id: number): __Observable<null> {
    return this.deleteCustomerUsingDELETEResponse(id).pipe(
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
   * @param favouriteProductDTO favouriteProductDTO
   * @return OK
   */
  createFavouriteProductUsingPOSTResponse(favouriteProductDTO: FavouriteProductDTO): __Observable<__StrictHttpResponse<FavouriteProductDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = favouriteProductDTO;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/favouriteproduct`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<FavouriteProductDTO>;
      })
    );
  }
  /**
   * @param favouriteProductDTO favouriteProductDTO
   * @return OK
   */
  createFavouriteProductUsingPOST(favouriteProductDTO: FavouriteProductDTO): __Observable<FavouriteProductDTO> {
    return this.createFavouriteProductUsingPOSTResponse(favouriteProductDTO).pipe(
      __map(_r => _r.body as FavouriteProductDTO)
    );
  }

  /**
   * @param id id
   */
  deleteFavouriteProductUsingDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/command/favouriteproduct/${id}`,
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
  deleteFavouriteProductUsingDELETE(id: number): __Observable<null> {
    return this.deleteFavouriteProductUsingDELETEResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param favouriteStoreDTO favouriteStoreDTO
   * @return OK
   */
  createFavouriteStoreUsingPOSTResponse(favouriteStoreDTO: FavouriteStoreDTO): __Observable<__StrictHttpResponse<FavouriteStoreDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = favouriteStoreDTO;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/favouritestore`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<FavouriteStoreDTO>;
      })
    );
  }
  /**
   * @param favouriteStoreDTO favouriteStoreDTO
   * @return OK
   */
  createFavouriteStoreUsingPOST(favouriteStoreDTO: FavouriteStoreDTO): __Observable<FavouriteStoreDTO> {
    return this.createFavouriteStoreUsingPOSTResponse(favouriteStoreDTO).pipe(
      __map(_r => _r.body as FavouriteStoreDTO)
    );
  }

  /**
   * @param id id
   */
  deleteFavouriteStoreUsingDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/command/favouritestore/${id}`,
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
  deleteFavouriteStoreUsingDELETE(id: number): __Observable<null> {
    return this.deleteFavouriteStoreUsingDELETEResponse(id).pipe(
      __map(_r => _r.body as null)
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
    console.error(__body);
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
   * @param params The `CommandResourceService.CollectDeliveryDetailsUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `orderId`: orderId
   *
   * - `deliveryInfo`: deliveryInfo
   *
   * @return OK
   */
  collectDeliveryDetailsUsingPOSTResponse(params: CommandResourceService.CollectDeliveryDetailsUsingPOSTParams): __Observable<__StrictHttpResponse<CommandResource>> {
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
   * @param params The `CommandResourceService.CollectDeliveryDetailsUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `orderId`: orderId
   *
   * - `deliveryInfo`: deliveryInfo
   *
   * @return OK
   */
  collectDeliveryDetailsUsingPOST(params: CommandResourceService.CollectDeliveryDetailsUsingPOSTParams): __Observable<CommandResource> {
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
   * @param params The `CommandResourceService.ExecutePaymentUsingPOSTParams` containing the following parameters:
   *
   * - `paymentId`: paymentId
   *
   * - `paymentExecutionRequest`: paymentExecutionRequest
   */
  executePaymentUsingPOSTResponse(params: CommandResourceService.ExecutePaymentUsingPOSTParams): __Observable<__StrictHttpResponse<null>> {
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
   * @param params The `CommandResourceService.ExecutePaymentUsingPOSTParams` containing the following parameters:
   *
   * - `paymentId`: paymentId
   *
   * - `paymentExecutionRequest`: paymentExecutionRequest
   */
  executePaymentUsingPOST(params: CommandResourceService.ExecutePaymentUsingPOSTParams): __Observable<null> {
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
   * @param params The `CommandResourceService.ProcessPaymentUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `status`: status
   *
   * - `paymentDTO`: paymentDTO
   *
   * @return OK
   */
  processPaymentUsingPOSTResponse(params: CommandResourceService.ProcessPaymentUsingPOSTParams): __Observable<__StrictHttpResponse<CommandResource>> {
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
        return _r as __StrictHttpResponse<CommandResource>;
      })
    );
  }
  /**
   * @param params The `CommandResourceService.ProcessPaymentUsingPOSTParams` containing the following parameters:
   *
   * - `taskId`: taskId
   *
   * - `status`: status
   *
   * - `paymentDTO`: paymentDTO
   *
   * @return OK
   */
  processPaymentUsingPOST(params: CommandResourceService.ProcessPaymentUsingPOSTParams): __Observable<CommandResource> {
    return this.processPaymentUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as CommandResource)
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

  /**
   * @param replyDTO replyDTO
   * @return OK
   */
  createReplyUsingPOSTResponse(replyDTO: ReplyDTO): __Observable<__StrictHttpResponse<ReplyDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = replyDTO;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/replies`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ReplyDTO>;
      })
    );
  }
  /**
   * @param replyDTO replyDTO
   * @return OK
   */
  createReplyUsingPOST(replyDTO: ReplyDTO): __Observable<ReplyDTO> {
    return this.createReplyUsingPOSTResponse(replyDTO).pipe(
      __map(_r => _r.body as ReplyDTO)
    );
  }

  /**
   * @param replyDTO replyDTO
   * @return OK
   */
  updateReplyUsingPUTResponse(replyDTO: ReplyDTO): __Observable<__StrictHttpResponse<ReplyDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = replyDTO;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/api/command/replies`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ReplyDTO>;
      })
    );
  }
  /**
   * @param replyDTO replyDTO
   * @return OK
   */
  updateReplyUsingPUT(replyDTO: ReplyDTO): __Observable<ReplyDTO> {
    return this.updateReplyUsingPUTResponse(replyDTO).pipe(
      __map(_r => _r.body as ReplyDTO)
    );
  }

  /**
   * @param id id
   */
  deleteReplyUsingDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/command/replies/${id}`,
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
  deleteReplyUsingDELETE(id: number): __Observable<null> {
    return this.deleteReplyUsingDELETEResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param paymentTransaction paymentTransaction
   * @return OK
   */
  createTransactionUsingPOSTResponse(paymentTransaction: PaymentTransaction): __Observable<__StrictHttpResponse<PaymentTransactionResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = paymentTransaction;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/transaction`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaymentTransactionResponse>;
      })
    );
  }
  /**
   * @param paymentTransaction paymentTransaction
   * @return OK
   */
  createTransactionUsingPOST(paymentTransaction: PaymentTransaction): __Observable<PaymentTransactionResponse> {
    return this.createTransactionUsingPOSTResponse(paymentTransaction).pipe(
      __map(_r => _r.body as PaymentTransactionResponse)
    );
  }

  /**
   * @param params The `CommandResourceService.UpdateLoyaltyPointUsingPOSTParams` containing the following parameters:
   *
   * - `point`: point
   *
   * - `orderId`: orderId
   *
   * - `idpCode`: idpCode
   *
   * @return OK
   */
  updateLoyaltyPointUsingPOSTResponse(params: CommandResourceService.UpdateLoyaltyPointUsingPOSTParams): __Observable<__StrictHttpResponse<CustomerDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/updateLoyaltyPoint/${params.idpCode}/${params.point}/${params.orderId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CustomerDTO>;
      })
    );
  }
  /**
   * @param params The `CommandResourceService.UpdateLoyaltyPointUsingPOSTParams` containing the following parameters:
   *
   * - `point`: point
   *
   * - `orderId`: orderId
   *
   * - `idpCode`: idpCode
   *
   * @return OK
   */
  updateLoyaltyPointUsingPOST(params: CommandResourceService.UpdateLoyaltyPointUsingPOSTParams): __Observable<CustomerDTO> {
    return this.updateLoyaltyPointUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as CustomerDTO)
    );
  }

  /**
   * @param userRatingReviewDTO userRatingReviewDTO
   * @return OK
   */
  createUserRatingReviewUsingPOSTResponse(userRatingReviewDTO: UserRatingReviewDTO): __Observable<__StrictHttpResponse<UserRatingReviewDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = userRatingReviewDTO;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/command/user-rating-review`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserRatingReviewDTO>;
      })
    );
  }
  /**
   * @param userRatingReviewDTO userRatingReviewDTO
   * @return OK
   */
  createUserRatingReviewUsingPOST(userRatingReviewDTO: UserRatingReviewDTO): __Observable<UserRatingReviewDTO> {
    return this.createUserRatingReviewUsingPOSTResponse(userRatingReviewDTO).pipe(
      __map(_r => _r.body as UserRatingReviewDTO)
    );
  }
}

module CommandResourceService {

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

  /**
   * Parameters for verifyOTPUsingPOST
   */
  export interface VerifyOTPUsingPOSTParams {

    /**
     * numbers
     */
    numbers: number;

    /**
     * code
     */
    code: string;
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

  /**
   * Parameters for updateLoyaltyPointUsingPOST
   */
  export interface UpdateLoyaltyPointUsingPOSTParams {

    /**
     * point
     */
    point: number;

    /**
     * orderId
     */
    orderId: string;

    /**
     * idpCode
     */
    idpCode: string;
  }
}

export { CommandResourceService }
