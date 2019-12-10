/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { PageOfAuxilaryLineItem } from '../models/page-of-auxilary-line-item';
import { PageOfComboLineItem } from '../models/page-of-combo-line-item';
import { ContactDTO } from '../models/contact-dto';
import { CustomerDTO } from '../models/customer-dto';
import { PageOfType } from '../models/page-of-type';
import { PageOfDeliveryInfo } from '../models/page-of-delivery-info';
import { Discount } from '../models/discount';
import { PageOfStore } from '../models/page-of-store';
import { StoreTypeWrapper } from '../models/store-type-wrapper';
import { PageOfFavouriteProduct } from '../models/page-of-favourite-product';
import { PageOfFavouriteStore } from '../models/page-of-favourite-store';
import { PageOfCategory } from '../models/page-of-category';
import { PageOfOrderLine } from '../models/page-of-order-line';
import { PageOfAuxilaryOrderLine } from '../models/page-of-auxilary-order-line';
import { ResultBucket } from '../models/result-bucket';
import { Offer } from '../models/offer';
import { Product } from '../models/product';
import { PageOfProduct } from '../models/page-of-product';
import { PageOfStockCurrent } from '../models/page-of-stock-current';
import { StockCurrent } from '../models/stock-current';
import { Store } from '../models/store';
import { PageOfUserRatingReview } from '../models/page-of-user-rating-review';
import { PageOfNotification } from '../models/page-of-notification';
import { PageOfOrder } from '../models/page-of-order';
import { Order } from '../models/order';
import { OrderAggregator } from '../models/order-aggregator';
import { PageOfAddress } from '../models/page-of-address';
import { ProductDTO } from '../models/product-dto';
import { PageOfStoreType } from '../models/page-of-store-type';
import { StoreAddress } from '../models/store-address';
import { StoreSettings } from '../models/store-settings';
import { PageOfBanner } from '../models/page-of-banner';
import { OpenTask } from '../models/open-task';

/**
 * Query Resource
 */
@Injectable({
  providedIn: 'root',
})
class QueryResourceService extends __BaseService {
  static readonly findAuxilariesByProductIdUsingGETPath = '/api/query/auxilaries-productId/{productId}';
  static readonly checkUserExistsByIdpcodeUsingGETPath = '/api/query/checkUserExistsByIdpcode/{idpCode}';
  static readonly findComboByProductIdUsingGETPath = '/api/query/combos-productId/{productId}';
  static readonly findContactByIdUsingGETPath = '/api/query/contacts/{id}';
  static readonly findCustomerByIdpCodeUsingGETPath = '/api/query/customers/findCustomerByIdpCode/{idpCode}';
  static readonly findAllDeliveryTypesByStoreIdUsingGETPath = '/api/query/deliveryTypes/{storeId}';
  static readonly findDeliveryInfoByStoreIdUsingGETPath = '/api/query/deliveryinfoByStoreId/{storeId}';
  static readonly findDiscountByProductIdUsingGETPath = '/api/query/discount-productId/{productId}';
  static readonly facetSearchByStoreTypeNameUsingPOSTPath = '/api/query/facetSearchByStoreTypeName';
  static readonly findFavouriteProductsByCustomerIdpCodeUsingGETPath = '/api/query/favouriteproductsbycustomeridpcode/{idpCode}';
  static readonly findFavouriteStoresByCustomerIdpCodeUsingGETPath = '/api/query/favouritestoresbycustomeridpcode/{idpCode}';
  static readonly findAllCategoriesUsingGETPath = '/api/query/findAllCategories/{iDPcode}';
  static readonly findAllOrderLinesByOrderIdUsingGETPath = '/api/query/findAllOrderLinesByOrderId/{orderId}';
  static readonly findAuxilaryOrderLineByOrderLineIdUsingGETPath = '/api/query/findAuxilaryOrderLineByOrderLineId/{orderLineId}';
  static readonly findCategoryAndCountBystoreIdUsingGETPath = '/api/query/findCategoryAndCountBystoreId/{storeId}';
  static readonly findByMobileNumberUsingGETPath = '/api/query/findCustomerByMobileNumber/{mobileNumber}';
  static readonly findOfferLinesByOrderIdUsingGETPath = '/api/query/findOfferLinesByOrderId/{id}';
  static readonly findProductByIdUsingGETPath = '/api/query/findProductById/{id}';
  static readonly findProductsByCategoryNameUsingGETPath = '/api/query/findProductsByCategoryName/{name}';
  static readonly findStockCurrentByProductNameAndStoreIdUsingGETPath = '/api/query/findStockCurrentByProductNameStoreId/{name}/{storeId}';
  static readonly findStockCurrentByStoreIdAndCategoryIdUsingGETPath = '/api/query/findStockCurrentByStoreIdAndCategoryId/{userId}/{categoryId}';
  static readonly findStoreByIdUsingGETPath = '/api/query/findStoreById/{id}';
  static readonly findStoreByNearLocationUsingGETPath = '/api/query/findStoreByNearLocation/{lat}/{lon}/{distance}/{distanceUnit}';
  static readonly findStoreTypeAndCountUsingGETPath = '/api/query/findStoreTypeAndCount';
  static readonly findUserRatingReviewByRegNoUsingGETPath = '/api/query/findUserRatingReview/{regNo}';
  static readonly findNotificationByReceiverIdUsingGETPath = '/api/query/findnotificationbyreceiverid/{receiverId}';
  static readonly findNotificationCountByReceiverIdAndStatusNameUsingGETPath = '/api/query/findnotificationcount/{receiverId}/{status}';
  static readonly headerUsingGETPath = '/api/query/header/{searchTerm}';
  static readonly findOrderByDatebetweenAndStoreIdUsingGETPath = '/api/query/order/{from}/{to}/{storeId}';
  static readonly findOrderByOrderIdUsingGETPath = '/api/query/orderByOrderId/{orderId}';
  static readonly findOrderByStatusNameUsingGETPath = '/api/query/orderStatus/{statusName}';
  static readonly getOrderAggregatorUsingGETPath = '/api/query/orderaggregator/{orderNumber}';
  static readonly getAllSavedAddressUsingGETPath = '/api/query/orders/addresses/{customerId}';
  static readonly findOrdersByCustomerIdUsingGETPath = '/api/query/ordersByCustomerId/{customerId}';
  static readonly findAndSortProductByPriceUsingGETPath = '/api/query/productByPrice/{from}/{to}';
  static readonly findProductUsingGETPath = '/api/query/products/{id}';
  static readonly findUserRatingReviewCountByRegNoUsingGETPath = '/api/query/review-count/{regNo}';
  static readonly findAndSortStoreByMinAmountUsingGETPath = '/api/query/sortStoreByMinAmount';
  static readonly findStockCurrentByCategoryNameAndStoreIdUsingGETPath = '/api/query/stock-current-by-categoryname/{categoryName}/{storeId}';
  static readonly findStockCurrentByStoreIdUsingGETPath = '/api/query/stockcurrent/{storeId}';
  static readonly findStoreTypeByStoreIdUsingGETPath = '/api/query/store-type/{storeId}';
  static readonly findStoreByRegisterNumberUsingGETPath = '/api/query/store/{regNo}';
  static readonly getStoreAddressUsingGETPath = '/api/query/storeAddress/{IDPCode}';
  static readonly findStoreByRatingUsingGETPath = '/api/query/storeByRating';
  static readonly getStoreSettingsUsingGETPath = '/api/query/storeSettings/{IDPCode}';
  static readonly findAllStoresUsingGETPath = '/api/query/stores';
  static readonly findStoreBannerUsingGETPath = '/api/query/stores/banners';
  static readonly getTaskDetailsUsingGETPath = '/api/query/taskDetails/{taskName}/{orderId}/{storeId}';
  static readonly getTasksUsingGETPath = '/api/query/tasks';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `QueryResourceService.FindAuxilariesByProductIdUsingGETParams` containing the following parameters:
   *
   * - `productId`: productId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAuxilariesByProductIdUsingGETResponse(params: QueryResourceService.FindAuxilariesByProductIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfAuxilaryLineItem>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/auxilaries-productId/${params.productId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfAuxilaryLineItem>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAuxilariesByProductIdUsingGETParams` containing the following parameters:
   *
   * - `productId`: productId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAuxilariesByProductIdUsingGET(params: QueryResourceService.FindAuxilariesByProductIdUsingGETParams): __Observable<PageOfAuxilaryLineItem> {
    return this.findAuxilariesByProductIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfAuxilaryLineItem)
    );
  }

  /**
   * @param idpCode idpCode
   * @return OK
   */
  checkUserExistsByIdpcodeUsingGETResponse(idpCode: string): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/checkUserExistsByIdpcode/${idpCode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param idpCode idpCode
   * @return OK
   */
  checkUserExistsByIdpcodeUsingGET(idpCode: string): __Observable<boolean> {
    return this.checkUserExistsByIdpcodeUsingGETResponse(idpCode).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param params The `QueryResourceService.FindComboByProductIdUsingGETParams` containing the following parameters:
   *
   * - `productId`: productId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findComboByProductIdUsingGETResponse(params: QueryResourceService.FindComboByProductIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfComboLineItem>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/combos-productId/${params.productId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfComboLineItem>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindComboByProductIdUsingGETParams` containing the following parameters:
   *
   * - `productId`: productId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findComboByProductIdUsingGET(params: QueryResourceService.FindComboByProductIdUsingGETParams): __Observable<PageOfComboLineItem> {
    return this.findComboByProductIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfComboLineItem)
    );
  }

  /**
   * @param id id
   * @return OK
   */
  findContactByIdUsingGETResponse(id: number): __Observable<__StrictHttpResponse<ContactDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/contacts/${id}`,
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
   * @param id id
   * @return OK
   */
  findContactByIdUsingGET(id: number): __Observable<ContactDTO> {
    return this.findContactByIdUsingGETResponse(id).pipe(
      __map(_r => _r.body as ContactDTO)
    );
  }

  /**
   * @param idpCode idpCode
   * @return OK
   */
  findCustomerByIdpCodeUsingGETResponse(idpCode: string): __Observable<__StrictHttpResponse<CustomerDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/customers/findCustomerByIdpCode/${idpCode}`,
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
   * @param idpCode idpCode
   * @return OK
   */
  findCustomerByIdpCodeUsingGET(idpCode: string): __Observable<CustomerDTO> {
    return this.findCustomerByIdpCodeUsingGETResponse(idpCode).pipe(
      __map(_r => _r.body as CustomerDTO)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAllDeliveryTypesByStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllDeliveryTypesByStoreIdUsingGETResponse(params: QueryResourceService.FindAllDeliveryTypesByStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/deliveryTypes/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfType>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAllDeliveryTypesByStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllDeliveryTypesByStoreIdUsingGET(params: QueryResourceService.FindAllDeliveryTypesByStoreIdUsingGETParams): __Observable<PageOfType> {
    return this.findAllDeliveryTypesByStoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfType)
    );
  }

  /**
   * @param params The `QueryResourceService.FindDeliveryInfoByStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findDeliveryInfoByStoreIdUsingGETResponse(params: QueryResourceService.FindDeliveryInfoByStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfDeliveryInfo>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/deliveryinfoByStoreId/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfDeliveryInfo>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindDeliveryInfoByStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findDeliveryInfoByStoreIdUsingGET(params: QueryResourceService.FindDeliveryInfoByStoreIdUsingGETParams): __Observable<PageOfDeliveryInfo> {
    return this.findDeliveryInfoByStoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfDeliveryInfo)
    );
  }

  /**
   * @param productId productId
   * @return OK
   */
  findDiscountByProductIdUsingGETResponse(productId: number): __Observable<__StrictHttpResponse<Discount>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/discount-productId/${productId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Discount>;
      })
    );
  }
  /**
   * @param productId productId
   * @return OK
   */
  findDiscountByProductIdUsingGET(productId: number): __Observable<Discount> {
    return this.findDiscountByProductIdUsingGETResponse(productId).pipe(
      __map(_r => _r.body as Discount)
    );
  }

  /**
   * @param params The `QueryResourceService.FacetSearchByStoreTypeNameUsingPOSTParams` containing the following parameters:
   *
   * - `storeTypeWrapper`: storeTypeWrapper
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  facetSearchByStoreTypeNameUsingPOSTResponse(params: QueryResourceService.FacetSearchByStoreTypeNameUsingPOSTParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.storeTypeWrapper;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/query/facetSearchByStoreTypeName`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStore>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FacetSearchByStoreTypeNameUsingPOSTParams` containing the following parameters:
   *
   * - `storeTypeWrapper`: storeTypeWrapper
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  facetSearchByStoreTypeNameUsingPOST(params: QueryResourceService.FacetSearchByStoreTypeNameUsingPOSTParams): __Observable<PageOfStore> {
    return this.facetSearchByStoreTypeNameUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
    );
  }

  /**
   * @param params The `QueryResourceService.FindFavouriteProductsByCustomerIdpCodeUsingGETParams` containing the following parameters:
   *
   * - `idpCode`: idpCode
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findFavouriteProductsByCustomerIdpCodeUsingGETResponse(params: QueryResourceService.FindFavouriteProductsByCustomerIdpCodeUsingGETParams): __Observable<__StrictHttpResponse<PageOfFavouriteProduct>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/favouriteproductsbycustomeridpcode/${params.idpCode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfFavouriteProduct>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindFavouriteProductsByCustomerIdpCodeUsingGETParams` containing the following parameters:
   *
   * - `idpCode`: idpCode
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findFavouriteProductsByCustomerIdpCodeUsingGET(params: QueryResourceService.FindFavouriteProductsByCustomerIdpCodeUsingGETParams): __Observable<PageOfFavouriteProduct> {
    return this.findFavouriteProductsByCustomerIdpCodeUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfFavouriteProduct)
    );
  }

  /**
   * @param params The `QueryResourceService.FindFavouriteStoresByCustomerIdpCodeUsingGETParams` containing the following parameters:
   *
   * - `idpCode`: idpCode
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findFavouriteStoresByCustomerIdpCodeUsingGETResponse(params: QueryResourceService.FindFavouriteStoresByCustomerIdpCodeUsingGETParams): __Observable<__StrictHttpResponse<PageOfFavouriteStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/favouritestoresbycustomeridpcode/${params.idpCode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfFavouriteStore>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindFavouriteStoresByCustomerIdpCodeUsingGETParams` containing the following parameters:
   *
   * - `idpCode`: idpCode
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findFavouriteStoresByCustomerIdpCodeUsingGET(params: QueryResourceService.FindFavouriteStoresByCustomerIdpCodeUsingGETParams): __Observable<PageOfFavouriteStore> {
    return this.findFavouriteStoresByCustomerIdpCodeUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfFavouriteStore)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAllCategoriesUsingGETParams` containing the following parameters:
   *
   * - `iDPcode`: iDPcode
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllCategoriesUsingGETResponse(params: QueryResourceService.FindAllCategoriesUsingGETParams): __Observable<__StrictHttpResponse<PageOfCategory>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findAllCategories/${params.iDPcode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfCategory>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAllCategoriesUsingGETParams` containing the following parameters:
   *
   * - `iDPcode`: iDPcode
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllCategoriesUsingGET(params: QueryResourceService.FindAllCategoriesUsingGETParams): __Observable<PageOfCategory> {
    return this.findAllCategoriesUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfCategory)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAllOrderLinesByOrderIdUsingGETParams` containing the following parameters:
   *
   * - `orderId`: orderId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllOrderLinesByOrderIdUsingGETResponse(params: QueryResourceService.FindAllOrderLinesByOrderIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfOrderLine>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findAllOrderLinesByOrderId/${params.orderId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfOrderLine>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAllOrderLinesByOrderIdUsingGETParams` containing the following parameters:
   *
   * - `orderId`: orderId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllOrderLinesByOrderIdUsingGET(params: QueryResourceService.FindAllOrderLinesByOrderIdUsingGETParams): __Observable<PageOfOrderLine> {
    return this.findAllOrderLinesByOrderIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfOrderLine)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAuxilaryOrderLineByOrderLineIdUsingGETParams` containing the following parameters:
   *
   * - `orderLineId`: orderLineId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAuxilaryOrderLineByOrderLineIdUsingGETResponse(params: QueryResourceService.FindAuxilaryOrderLineByOrderLineIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfAuxilaryOrderLine>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findAuxilaryOrderLineByOrderLineId/${params.orderLineId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfAuxilaryOrderLine>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAuxilaryOrderLineByOrderLineIdUsingGETParams` containing the following parameters:
   *
   * - `orderLineId`: orderLineId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAuxilaryOrderLineByOrderLineIdUsingGET(params: QueryResourceService.FindAuxilaryOrderLineByOrderLineIdUsingGETParams): __Observable<PageOfAuxilaryOrderLine> {
    return this.findAuxilaryOrderLineByOrderLineIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfAuxilaryOrderLine)
    );
  }

  /**
   * @param params The `QueryResourceService.FindCategoryAndCountBystoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findCategoryAndCountBystoreIdUsingGETResponse(params: QueryResourceService.FindCategoryAndCountBystoreIdUsingGETParams): __Observable<__StrictHttpResponse<Array<ResultBucket>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findCategoryAndCountBystoreId/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ResultBucket>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindCategoryAndCountBystoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findCategoryAndCountBystoreIdUsingGET(params: QueryResourceService.FindCategoryAndCountBystoreIdUsingGETParams): __Observable<Array<ResultBucket>> {
    return this.findCategoryAndCountBystoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<ResultBucket>)
    );
  }

  /**
   * @param mobileNumber mobileNumber
   * @return OK
   */
  findByMobileNumberUsingGETResponse(mobileNumber: number): __Observable<__StrictHttpResponse<CustomerDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findCustomerByMobileNumber/${mobileNumber}`,
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
   * @param mobileNumber mobileNumber
   * @return OK
   */
  findByMobileNumberUsingGET(mobileNumber: number): __Observable<CustomerDTO> {
    return this.findByMobileNumberUsingGETResponse(mobileNumber).pipe(
      __map(_r => _r.body as CustomerDTO)
    );
  }

  /**
   * @param id id
   * @return OK
   */
  findOfferLinesByOrderIdUsingGETResponse(id: number): __Observable<__StrictHttpResponse<Array<Offer>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findOfferLinesByOrderId/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Offer>>;
      })
    );
  }
  /**
   * @param id id
   * @return OK
   */
  findOfferLinesByOrderIdUsingGET(id: number): __Observable<Array<Offer>> {
    return this.findOfferLinesByOrderIdUsingGETResponse(id).pipe(
      __map(_r => _r.body as Array<Offer>)
    );
  }

  /**
   * @param id id
   * @return OK
   */
  findProductByIdUsingGETResponse(id: number): __Observable<__StrictHttpResponse<Product>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findProductById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Product>;
      })
    );
  }
  /**
   * @param id id
   * @return OK
   */
  findProductByIdUsingGET(id: number): __Observable<Product> {
    return this.findProductByIdUsingGETResponse(id).pipe(
      __map(_r => _r.body as Product)
    );
  }

  /**
   * @param params The `QueryResourceService.FindProductsByCategoryNameUsingGETParams` containing the following parameters:
   *
   * - `name`: name
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findProductsByCategoryNameUsingGETResponse(params: QueryResourceService.FindProductsByCategoryNameUsingGETParams): __Observable<__StrictHttpResponse<PageOfProduct>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findProductsByCategoryName/${params.name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfProduct>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindProductsByCategoryNameUsingGETParams` containing the following parameters:
   *
   * - `name`: name
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findProductsByCategoryNameUsingGET(params: QueryResourceService.FindProductsByCategoryNameUsingGETParams): __Observable<PageOfProduct> {
    return this.findProductsByCategoryNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfProduct)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStockCurrentByProductNameAndStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `name`: name
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStockCurrentByProductNameAndStoreIdUsingGETResponse(params: QueryResourceService.FindStockCurrentByProductNameAndStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfStockCurrent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findStockCurrentByProductNameStoreId/${params.name}/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStockCurrent>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStockCurrentByProductNameAndStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `name`: name
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStockCurrentByProductNameAndStoreIdUsingGET(params: QueryResourceService.FindStockCurrentByProductNameAndStoreIdUsingGETParams): __Observable<PageOfStockCurrent> {
    return this.findStockCurrentByProductNameAndStoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStockCurrent)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStockCurrentByStoreIdAndCategoryIdUsingGETParams` containing the following parameters:
   *
   * - `userId`: userId
   *
   * - `categoryId`: categoryId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStockCurrentByStoreIdAndCategoryIdUsingGETResponse(params: QueryResourceService.FindStockCurrentByStoreIdAndCategoryIdUsingGETParams): __Observable<__StrictHttpResponse<Array<StockCurrent>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findStockCurrentByStoreIdAndCategoryId/${params.userId}/${params.categoryId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<StockCurrent>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStockCurrentByStoreIdAndCategoryIdUsingGETParams` containing the following parameters:
   *
   * - `userId`: userId
   *
   * - `categoryId`: categoryId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStockCurrentByStoreIdAndCategoryIdUsingGET(params: QueryResourceService.FindStockCurrentByStoreIdAndCategoryIdUsingGETParams): __Observable<Array<StockCurrent>> {
    return this.findStockCurrentByStoreIdAndCategoryIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<StockCurrent>)
    );
  }

  /**
   * @param id id
   * @return OK
   */
  findStoreByIdUsingGETResponse(id: number): __Observable<__StrictHttpResponse<Store>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findStoreById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Store>;
      })
    );
  }
  /**
   * @param id id
   * @return OK
   */
  findStoreByIdUsingGET(id: number): __Observable<Store> {
    return this.findStoreByIdUsingGETResponse(id).pipe(
      __map(_r => _r.body as Store)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStoreByNearLocationUsingGETParams` containing the following parameters:
   *
   * - `lon`: lon
   *
   * - `lat`: lat
   *
   * - `distanceUnit`: distanceUnit
   *
   * - `distance`: distance
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreByNearLocationUsingGETResponse(params: QueryResourceService.FindStoreByNearLocationUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findStoreByNearLocation/${params.lat}/${params.lon}/${params.distance}/${params.distanceUnit}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStore>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStoreByNearLocationUsingGETParams` containing the following parameters:
   *
   * - `lon`: lon
   *
   * - `lat`: lat
   *
   * - `distanceUnit`: distanceUnit
   *
   * - `distance`: distance
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreByNearLocationUsingGET(params: QueryResourceService.FindStoreByNearLocationUsingGETParams): __Observable<PageOfStore> {
    return this.findStoreByNearLocationUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStoreTypeAndCountUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreTypeAndCountUsingGETResponse(params: QueryResourceService.FindStoreTypeAndCountUsingGETParams): __Observable<__StrictHttpResponse<Array<ResultBucket>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findStoreTypeAndCount`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ResultBucket>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStoreTypeAndCountUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreTypeAndCountUsingGET(params: QueryResourceService.FindStoreTypeAndCountUsingGETParams): __Observable<Array<ResultBucket>> {
    return this.findStoreTypeAndCountUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<ResultBucket>)
    );
  }

  /**
   * @param params The `QueryResourceService.FindUserRatingReviewByRegNoUsingGETParams` containing the following parameters:
   *
   * - `regNo`: regNo
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findUserRatingReviewByRegNoUsingGETResponse(params: QueryResourceService.FindUserRatingReviewByRegNoUsingGETParams): __Observable<__StrictHttpResponse<PageOfUserRatingReview>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findUserRatingReview/${params.regNo}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfUserRatingReview>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindUserRatingReviewByRegNoUsingGETParams` containing the following parameters:
   *
   * - `regNo`: regNo
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findUserRatingReviewByRegNoUsingGET(params: QueryResourceService.FindUserRatingReviewByRegNoUsingGETParams): __Observable<PageOfUserRatingReview> {
    return this.findUserRatingReviewByRegNoUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfUserRatingReview)
    );
  }

  /**
   * @param params The `QueryResourceService.FindNotificationByReceiverIdUsingGETParams` containing the following parameters:
   *
   * - `receiverId`: receiverId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findNotificationByReceiverIdUsingGETResponse(params: QueryResourceService.FindNotificationByReceiverIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfNotification>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findnotificationbyreceiverid/${params.receiverId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfNotification>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindNotificationByReceiverIdUsingGETParams` containing the following parameters:
   *
   * - `receiverId`: receiverId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findNotificationByReceiverIdUsingGET(params: QueryResourceService.FindNotificationByReceiverIdUsingGETParams): __Observable<PageOfNotification> {
    return this.findNotificationByReceiverIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfNotification)
    );
  }

  /**
   * @param params The `QueryResourceService.FindNotificationCountByReceiverIdAndStatusNameUsingGETParams` containing the following parameters:
   *
   * - `status`: status
   *
   * - `receiverId`: receiverId
   *
   * @return OK
   */
  findNotificationCountByReceiverIdAndStatusNameUsingGETResponse(params: QueryResourceService.FindNotificationCountByReceiverIdAndStatusNameUsingGETParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findnotificationcount/${params.receiverId}/${params.status}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindNotificationCountByReceiverIdAndStatusNameUsingGETParams` containing the following parameters:
   *
   * - `status`: status
   *
   * - `receiverId`: receiverId
   *
   * @return OK
   */
  findNotificationCountByReceiverIdAndStatusNameUsingGET(params: QueryResourceService.FindNotificationCountByReceiverIdAndStatusNameUsingGETParams): __Observable<number> {
    return this.findNotificationCountByReceiverIdAndStatusNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `QueryResourceService.HeaderUsingGETParams` containing the following parameters:
   *
   * - `searchTerm`: searchTerm
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  headerUsingGETResponse(params: QueryResourceService.HeaderUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/header/${params.searchTerm}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStore>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.HeaderUsingGETParams` containing the following parameters:
   *
   * - `searchTerm`: searchTerm
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  headerUsingGET(params: QueryResourceService.HeaderUsingGETParams): __Observable<PageOfStore> {
    return this.headerUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
    );
  }

  /**
   * @param params The `QueryResourceService.FindOrderByDatebetweenAndStoreIdUsingGETParams` containing the following parameters:
   *
   * - `to`: to
   *
   * - `storeId`: storeId
   *
   * - `from`: from
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findOrderByDatebetweenAndStoreIdUsingGETResponse(params: QueryResourceService.FindOrderByDatebetweenAndStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfOrder>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/order/${params.from}/${params.to}/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfOrder>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindOrderByDatebetweenAndStoreIdUsingGETParams` containing the following parameters:
   *
   * - `to`: to
   *
   * - `storeId`: storeId
   *
   * - `from`: from
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findOrderByDatebetweenAndStoreIdUsingGET(params: QueryResourceService.FindOrderByDatebetweenAndStoreIdUsingGETParams): __Observable<PageOfOrder> {
    return this.findOrderByDatebetweenAndStoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfOrder)
    );
  }

  /**
   * @param orderId orderId
   * @return OK
   */
  findOrderByOrderIdUsingGETResponse(orderId: string): __Observable<__StrictHttpResponse<Order>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/orderByOrderId/${orderId}`,
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
   * @param orderId orderId
   * @return OK
   */
  findOrderByOrderIdUsingGET(orderId: string): __Observable<Order> {
    return this.findOrderByOrderIdUsingGETResponse(orderId).pipe(
      __map(_r => _r.body as Order)
    );
  }

  /**
   * @param params The `QueryResourceService.FindOrderByStatusNameUsingGETParams` containing the following parameters:
   *
   * - `statusName`: statusName
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findOrderByStatusNameUsingGETResponse(params: QueryResourceService.FindOrderByStatusNameUsingGETParams): __Observable<__StrictHttpResponse<PageOfOrder>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/orderStatus/${params.statusName}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfOrder>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindOrderByStatusNameUsingGETParams` containing the following parameters:
   *
   * - `statusName`: statusName
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findOrderByStatusNameUsingGET(params: QueryResourceService.FindOrderByStatusNameUsingGETParams): __Observable<PageOfOrder> {
    return this.findOrderByStatusNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfOrder)
    );
  }

  /**
   * @param orderNumber orderNumber
   * @return OK
   */
  getOrderAggregatorUsingGETResponse(orderNumber: string): __Observable<__StrictHttpResponse<OrderAggregator>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/orderaggregator/${orderNumber}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OrderAggregator>;
      })
    );
  }
  /**
   * @param orderNumber orderNumber
   * @return OK
   */
  getOrderAggregatorUsingGET(orderNumber: string): __Observable<OrderAggregator> {
    return this.getOrderAggregatorUsingGETResponse(orderNumber).pipe(
      __map(_r => _r.body as OrderAggregator)
    );
  }

  /**
   * @param params The `QueryResourceService.GetAllSavedAddressUsingGETParams` containing the following parameters:
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
  getAllSavedAddressUsingGETResponse(params: QueryResourceService.GetAllSavedAddressUsingGETParams): __Observable<__StrictHttpResponse<PageOfAddress>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/orders/addresses/${params.customerId}`,
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
   * @param params The `QueryResourceService.GetAllSavedAddressUsingGETParams` containing the following parameters:
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
  getAllSavedAddressUsingGET(params: QueryResourceService.GetAllSavedAddressUsingGETParams): __Observable<PageOfAddress> {
    return this.getAllSavedAddressUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfAddress)
    );
  }

  /**
   * @param params The `QueryResourceService.FindOrdersByCustomerIdUsingGETParams` containing the following parameters:
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
  findOrdersByCustomerIdUsingGETResponse(params: QueryResourceService.FindOrdersByCustomerIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfOrder>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/ordersByCustomerId/${params.customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfOrder>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindOrdersByCustomerIdUsingGETParams` containing the following parameters:
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
  findOrdersByCustomerIdUsingGET(params: QueryResourceService.FindOrdersByCustomerIdUsingGETParams): __Observable<PageOfOrder> {
    return this.findOrdersByCustomerIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfOrder)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAndSortProductByPriceUsingGETParams` containing the following parameters:
   *
   * - `to`: to
   *
   * - `from`: from
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAndSortProductByPriceUsingGETResponse(params: QueryResourceService.FindAndSortProductByPriceUsingGETParams): __Observable<__StrictHttpResponse<PageOfStockCurrent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/productByPrice/${params.from}/${params.to}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStockCurrent>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAndSortProductByPriceUsingGETParams` containing the following parameters:
   *
   * - `to`: to
   *
   * - `from`: from
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAndSortProductByPriceUsingGET(params: QueryResourceService.FindAndSortProductByPriceUsingGETParams): __Observable<PageOfStockCurrent> {
    return this.findAndSortProductByPriceUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStockCurrent)
    );
  }

  /**
   * @param id id
   * @return OK
   */
  findProductUsingGETResponse(id: number): __Observable<__StrictHttpResponse<ProductDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/products/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ProductDTO>;
      })
    );
  }
  /**
   * @param id id
   * @return OK
   */
  findProductUsingGET(id: number): __Observable<ProductDTO> {
    return this.findProductUsingGETResponse(id).pipe(
      __map(_r => _r.body as ProductDTO)
    );
  }

  /**
   * @param regNo regNo
   * @return OK
   */
  findUserRatingReviewCountByRegNoUsingGETResponse(regNo: string): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/review-count/${regNo}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param regNo regNo
   * @return OK
   */
  findUserRatingReviewCountByRegNoUsingGET(regNo: string): __Observable<number> {
    return this.findUserRatingReviewCountByRegNoUsingGETResponse(regNo).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAndSortStoreByMinAmountUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAndSortStoreByMinAmountUsingGETResponse(params: QueryResourceService.FindAndSortStoreByMinAmountUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/sortStoreByMinAmount`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStore>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAndSortStoreByMinAmountUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAndSortStoreByMinAmountUsingGET(params: QueryResourceService.FindAndSortStoreByMinAmountUsingGETParams): __Observable<PageOfStore> {
    return this.findAndSortStoreByMinAmountUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStockCurrentByCategoryNameAndStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `categoryName`: categoryName
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStockCurrentByCategoryNameAndStoreIdUsingGETResponse(params: QueryResourceService.FindStockCurrentByCategoryNameAndStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfStockCurrent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/stock-current-by-categoryname/${params.categoryName}/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStockCurrent>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStockCurrentByCategoryNameAndStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `categoryName`: categoryName
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStockCurrentByCategoryNameAndStoreIdUsingGET(params: QueryResourceService.FindStockCurrentByCategoryNameAndStoreIdUsingGETParams): __Observable<PageOfStockCurrent> {
    return this.findStockCurrentByCategoryNameAndStoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStockCurrent)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStockCurrentByStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStockCurrentByStoreIdUsingGETResponse(params: QueryResourceService.FindStockCurrentByStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfStockCurrent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/stockcurrent/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStockCurrent>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStockCurrentByStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStockCurrentByStoreIdUsingGET(params: QueryResourceService.FindStockCurrentByStoreIdUsingGETParams): __Observable<PageOfStockCurrent> {
    return this.findStockCurrentByStoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStockCurrent)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStoreTypeByStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreTypeByStoreIdUsingGETResponse(params: QueryResourceService.FindStoreTypeByStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfStoreType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/store-type/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStoreType>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStoreTypeByStoreIdUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreTypeByStoreIdUsingGET(params: QueryResourceService.FindStoreTypeByStoreIdUsingGETParams): __Observable<PageOfStoreType> {
    return this.findStoreTypeByStoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStoreType)
    );
  }

  /**
   * @param regNo regNo
   * @return OK
   */
  findStoreByRegisterNumberUsingGETResponse(regNo: string): __Observable<__StrictHttpResponse<Store>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/store/${regNo}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Store>;
      })
    );
  }
  /**
   * @param regNo regNo
   * @return OK
   */
  findStoreByRegisterNumberUsingGET(regNo: string): __Observable<Store> {
    return this.findStoreByRegisterNumberUsingGETResponse(regNo).pipe(
      __map(_r => _r.body as Store)
    );
  }

  /**
   * @param IDPCode IDPCode
   * @return OK
   */
  getStoreAddressUsingGETResponse(IDPCode: string): __Observable<__StrictHttpResponse<StoreAddress>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/storeAddress/${IDPCode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<StoreAddress>;
      })
    );
  }
  /**
   * @param IDPCode IDPCode
   * @return OK
   */
  getStoreAddressUsingGET(IDPCode: string): __Observable<StoreAddress> {
    return this.getStoreAddressUsingGETResponse(IDPCode).pipe(
      __map(_r => _r.body as StoreAddress)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStoreByRatingUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreByRatingUsingGETResponse(params: QueryResourceService.FindStoreByRatingUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/storeByRating`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStore>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStoreByRatingUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreByRatingUsingGET(params: QueryResourceService.FindStoreByRatingUsingGETParams): __Observable<PageOfStore> {
    return this.findStoreByRatingUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
    );
  }

  /**
   * @param IDPCode IDPCode
   * @return OK
   */
  getStoreSettingsUsingGETResponse(IDPCode: string): __Observable<__StrictHttpResponse<StoreSettings>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/storeSettings/${IDPCode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<StoreSettings>;
      })
    );
  }
  /**
   * @param IDPCode IDPCode
   * @return OK
   */
  getStoreSettingsUsingGET(IDPCode: string): __Observable<StoreSettings> {
    return this.getStoreSettingsUsingGETResponse(IDPCode).pipe(
      __map(_r => _r.body as StoreSettings)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAllStoresUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllStoresUsingGETResponse(params: QueryResourceService.FindAllStoresUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/stores`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfStore>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAllStoresUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllStoresUsingGET(params: QueryResourceService.FindAllStoresUsingGETParams): __Observable<PageOfStore> {
    return this.findAllStoresUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStoreBannerUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreBannerUsingGETResponse(params: QueryResourceService.FindStoreBannerUsingGETParams): __Observable<__StrictHttpResponse<PageOfBanner>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/stores/banners`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfBanner>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStoreBannerUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreBannerUsingGET(params: QueryResourceService.FindStoreBannerUsingGETParams): __Observable<PageOfBanner> {
    return this.findStoreBannerUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfBanner)
    );
  }

  /**
   * @param params The `QueryResourceService.GetTaskDetailsUsingGETParams` containing the following parameters:
   *
   * - `taskName`: taskName
   *
   * - `storeId`: storeId
   *
   * - `orderId`: orderId
   *
   * @return OK
   */
  getTaskDetailsUsingGETResponse(params: QueryResourceService.GetTaskDetailsUsingGETParams): __Observable<__StrictHttpResponse<OpenTask>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/taskDetails/${params.taskName}/${params.orderId}/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OpenTask>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.GetTaskDetailsUsingGETParams` containing the following parameters:
   *
   * - `taskName`: taskName
   *
   * - `storeId`: storeId
   *
   * - `orderId`: orderId
   *
   * @return OK
   */
  getTaskDetailsUsingGET(params: QueryResourceService.GetTaskDetailsUsingGETParams): __Observable<OpenTask> {
    return this.getTaskDetailsUsingGETResponse(params).pipe(
      __map(_r => _r.body as OpenTask)
    );
  }

  /**
   * @param params The `QueryResourceService.GetTasksUsingGETParams` containing the following parameters:
   *
   * - `nameLike`: nameLike
   *
   * - `name`: name
   *
   * - `createdOn`: createdOn
   *
   * - `createdBefore`: createdBefore
   *
   * - `createdAfter`: createdAfter
   *
   * - `candidateUser`: candidateUser
   *
   * - `candidateGroups`: candidateGroups
   *
   * - `candidateGroup`: candidateGroup
   *
   * - `assigneeLike`: assigneeLike
   *
   * - `assignee`: assignee
   *
   * @return OK
   */
  getTasksUsingGETResponse(params: QueryResourceService.GetTasksUsingGETParams): __Observable<__StrictHttpResponse<Array<OpenTask>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.nameLike != null) __params = __params.set('nameLike', params.nameLike.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.createdOn != null) __params = __params.set('createdOn', params.createdOn.toString());
    if (params.createdBefore != null) __params = __params.set('createdBefore', params.createdBefore.toString());
    if (params.createdAfter != null) __params = __params.set('createdAfter', params.createdAfter.toString());
    if (params.candidateUser != null) __params = __params.set('candidateUser', params.candidateUser.toString());
    if (params.candidateGroups != null) __params = __params.set('candidateGroups', params.candidateGroups.toString());
    if (params.candidateGroup != null) __params = __params.set('candidateGroup', params.candidateGroup.toString());
    if (params.assigneeLike != null) __params = __params.set('assigneeLike', params.assigneeLike.toString());
    if (params.assignee != null) __params = __params.set('assignee', params.assignee.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/tasks`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<OpenTask>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.GetTasksUsingGETParams` containing the following parameters:
   *
   * - `nameLike`: nameLike
   *
   * - `name`: name
   *
   * - `createdOn`: createdOn
   *
   * - `createdBefore`: createdBefore
   *
   * - `createdAfter`: createdAfter
   *
   * - `candidateUser`: candidateUser
   *
   * - `candidateGroups`: candidateGroups
   *
   * - `candidateGroup`: candidateGroup
   *
   * - `assigneeLike`: assigneeLike
   *
   * - `assignee`: assignee
   *
   * @return OK
   */
  getTasksUsingGET(params: QueryResourceService.GetTasksUsingGETParams): __Observable<Array<OpenTask>> {
    return this.getTasksUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<OpenTask>)
    );
  }
}

module QueryResourceService {

  /**
   * Parameters for findAuxilariesByProductIdUsingGET
   */
  export interface FindAuxilariesByProductIdUsingGETParams {

    /**
     * productId
     */
    productId: number;

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
   * Parameters for findComboByProductIdUsingGET
   */
  export interface FindComboByProductIdUsingGETParams {

    /**
     * productId
     */
    productId: number;

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
   * Parameters for findAllDeliveryTypesByStoreIdUsingGET
   */
  export interface FindAllDeliveryTypesByStoreIdUsingGETParams {

    /**
     * storeId
     */
    storeId: number;

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
   * Parameters for findDeliveryInfoByStoreIdUsingGET
   */
  export interface FindDeliveryInfoByStoreIdUsingGETParams {

    /**
     * storeId
     */
    storeId: string;

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
   * Parameters for facetSearchByStoreTypeNameUsingPOST
   */
  export interface FacetSearchByStoreTypeNameUsingPOSTParams {

    /**
     * storeTypeWrapper
     */
    storeTypeWrapper: StoreTypeWrapper;

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
   * Parameters for findFavouriteProductsByCustomerIdpCodeUsingGET
   */
  export interface FindFavouriteProductsByCustomerIdpCodeUsingGETParams {

    /**
     * idpCode
     */
    idpCode: string;

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
   * Parameters for findFavouriteStoresByCustomerIdpCodeUsingGET
   */
  export interface FindFavouriteStoresByCustomerIdpCodeUsingGETParams {

    /**
     * idpCode
     */
    idpCode: string;

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
   * Parameters for findAllCategoriesUsingGET
   */
  export interface FindAllCategoriesUsingGETParams {

    /**
     * iDPcode
     */
    iDPcode: string;

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
   * Parameters for findAllOrderLinesByOrderIdUsingGET
   */
  export interface FindAllOrderLinesByOrderIdUsingGETParams {

    /**
     * orderId
     */
    orderId: number;

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
   * Parameters for findAuxilaryOrderLineByOrderLineIdUsingGET
   */
  export interface FindAuxilaryOrderLineByOrderLineIdUsingGETParams {

    /**
     * orderLineId
     */
    orderLineId: number;

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
   * Parameters for findCategoryAndCountBystoreIdUsingGET
   */
  export interface FindCategoryAndCountBystoreIdUsingGETParams {

    /**
     * storeId
     */
    storeId: string;

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
   * Parameters for findProductsByCategoryNameUsingGET
   */
  export interface FindProductsByCategoryNameUsingGETParams {

    /**
     * name
     */
    name: string;

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
   * Parameters for findStockCurrentByProductNameAndStoreIdUsingGET
   */
  export interface FindStockCurrentByProductNameAndStoreIdUsingGETParams {

    /**
     * storeId
     */
    storeId: string;

    /**
     * name
     */
    name: string;

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
   * Parameters for findStockCurrentByStoreIdAndCategoryIdUsingGET
   */
  export interface FindStockCurrentByStoreIdAndCategoryIdUsingGETParams {

    /**
     * userId
     */
    userId: string;

    /**
     * categoryId
     */
    categoryId: number;

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
   * Parameters for findStoreByNearLocationUsingGET
   */
  export interface FindStoreByNearLocationUsingGETParams {

    /**
     * lon
     */
    lon: number;

    /**
     * lat
     */
    lat: number;

    /**
     * distanceUnit
     */
    distanceUnit: string;

    /**
     * distance
     */
    distance: number;

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
   * Parameters for findStoreTypeAndCountUsingGET
   */
  export interface FindStoreTypeAndCountUsingGETParams {

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
   * Parameters for findUserRatingReviewByRegNoUsingGET
   */
  export interface FindUserRatingReviewByRegNoUsingGETParams {

    /**
     * regNo
     */
    regNo: string;

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
   * Parameters for findNotificationByReceiverIdUsingGET
   */
  export interface FindNotificationByReceiverIdUsingGETParams {

    /**
     * receiverId
     */
    receiverId: string;

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
   * Parameters for findNotificationCountByReceiverIdAndStatusNameUsingGET
   */
  export interface FindNotificationCountByReceiverIdAndStatusNameUsingGETParams {

    /**
     * status
     */
    status: string;

    /**
     * receiverId
     */
    receiverId: string;
  }

  /**
   * Parameters for headerUsingGET
   */
  export interface HeaderUsingGETParams {

    /**
     * searchTerm
     */
    searchTerm: string;

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
   * Parameters for findOrderByDatebetweenAndStoreIdUsingGET
   */
  export interface FindOrderByDatebetweenAndStoreIdUsingGETParams {

    /**
     * to
     */
    to: string;

    /**
     * storeId
     */
    storeId: string;

    /**
     * from
     */
    from: string;

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
   * Parameters for findOrderByStatusNameUsingGET
   */
  export interface FindOrderByStatusNameUsingGETParams {

    /**
     * statusName
     */
    statusName: string;

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
   * Parameters for findOrdersByCustomerIdUsingGET
   */
  export interface FindOrdersByCustomerIdUsingGETParams {

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
   * Parameters for findAndSortProductByPriceUsingGET
   */
  export interface FindAndSortProductByPriceUsingGETParams {

    /**
     * to
     */
    to: number;

    /**
     * from
     */
    from: number;

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
   * Parameters for findAndSortStoreByMinAmountUsingGET
   */
  export interface FindAndSortStoreByMinAmountUsingGETParams {

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
   * Parameters for findStockCurrentByCategoryNameAndStoreIdUsingGET
   */
  export interface FindStockCurrentByCategoryNameAndStoreIdUsingGETParams {

    /**
     * storeId
     */
    storeId: string;

    /**
     * categoryName
     */
    categoryName: string;

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
   * Parameters for findStockCurrentByStoreIdUsingGET
   */
  export interface FindStockCurrentByStoreIdUsingGETParams {

    /**
     * storeId
     */
    storeId: string;

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
   * Parameters for findStoreTypeByStoreIdUsingGET
   */
  export interface FindStoreTypeByStoreIdUsingGETParams {

    /**
     * storeId
     */
    storeId: string;

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
   * Parameters for findStoreByRatingUsingGET
   */
  export interface FindStoreByRatingUsingGETParams {

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
   * Parameters for findAllStoresUsingGET
   */
  export interface FindAllStoresUsingGETParams {

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
   * Parameters for findStoreBannerUsingGET
   */
  export interface FindStoreBannerUsingGETParams {

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
   * Parameters for getTaskDetailsUsingGET
   */
  export interface GetTaskDetailsUsingGETParams {

    /**
     * taskName
     */
    taskName: string;

    /**
     * storeId
     */
    storeId: string;

    /**
     * orderId
     */
    orderId: string;
  }

  /**
   * Parameters for getTasksUsingGET
   */
  export interface GetTasksUsingGETParams {

    /**
     * nameLike
     */
    nameLike?: string;

    /**
     * name
     */
    name?: string;

    /**
     * createdOn
     */
    createdOn?: string;

    /**
     * createdBefore
     */
    createdBefore?: string;

    /**
     * createdAfter
     */
    createdAfter?: string;

    /**
     * candidateUser
     */
    candidateUser?: string;

    /**
     * candidateGroups
     */
    candidateGroups?: string;

    /**
     * candidateGroup
     */
    candidateGroup?: string;

    /**
     * assigneeLike
     */
    assigneeLike?: string;

    /**
     * assignee
     */
    assignee?: string;
  }
}

export { QueryResourceService }
