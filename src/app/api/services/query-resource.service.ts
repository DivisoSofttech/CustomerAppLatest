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
import { PageOfFavouriteProduct } from '../models/page-of-favourite-product';
import { PageOfFavouriteStore } from '../models/page-of-favourite-store';
import { PageOfCategory } from '../models/page-of-category';
import { PageOfCustomer } from '../models/page-of-customer';
import { Entry } from '../models/entry';
import { OrderLine } from '../models/order-line';
import { PageOfProduct } from '../models/page-of-product';
import { Product } from '../models/product';
import { PageOfRatingReview } from '../models/page-of-rating-review';
import { PageOfStockCurrent } from '../models/page-of-stock-current';
import { StockCurrent } from '../models/stock-current';
import { PageOfStore } from '../models/page-of-store';
import { Store } from '../models/store';
import { PageOfNotification } from '../models/page-of-notification';
import { PageOfOrder } from '../models/page-of-order';
import { Order } from '../models/order';
import { ProductDTO } from '../models/product-dto';
import { UserRating } from '../models/user-rating';
import { Review } from '../models/review';
import { PageOfReview } from '../models/page-of-review';
import { StockCurrentDTO } from '../models/stock-current-dto';
import { PageOfStoreType } from '../models/page-of-store-type';
import { StoreAddress } from '../models/store-address';
import { StoreSettings } from '../models/store-settings';
import { BannerDTO } from '../models/banner-dto';
import { StoreTypeDTO } from '../models/store-type-dto';
import { OpenTask } from '../models/open-task';
import { PageOfUserRating } from '../models/page-of-user-rating';

/**
 * Query Resource
 */
@Injectable({
  providedIn: 'root',
})
class QueryResourceService extends __BaseService {
  static readonly findAuxilariesByProductIdUsingGETPath = '/api/query/auxilaries-productId/{productId}';
  static readonly findComboByProductIdUsingGETPath = '/api/query/combos-productId/{productId}';
  static readonly findContactByIdUsingGETPath = '/api/query/contacts/{id}';
  static readonly findCustomerByReferenceUsingGETPath = '/api/query/customers/findByReference/{reference}';
  static readonly findCustomerByIdUsingGETPath = '/api/query/customers/{id}';
  static readonly findAllDeliveryTypesByStoreIdUsingGETPath = '/api/query/deliveryTypes/{storeId}';
  static readonly findDeliveryInfoByStoreIdUsingGETPath = '/api/query/deliveryinfoByStoreId/{storeId}';
  static readonly findDiscountByProductIdUsingGETPath = '/api/query/discount-productId/{productId}';
  static readonly findFavouriteProductsByCustomerReferenceUsingGETPath = '/api/query/favouriteproductsbycustomerreference/{reference}';
  static readonly findFavouriteStoresByCustomerReferenceUsingGETPath = '/api/query/favouritestoresbycustomerreference/{reference}';
  static readonly findAllCategoriesUsingGETPath = '/api/query/findAllCategories/{iDPcode}';
  static readonly findAllCustomersWithoutSearchUsingGETPath = '/api/query/findAllCustomers';
  static readonly findCategoryAndCountUsingGETPath = '/api/query/findCategoryAndCount';
  static readonly findCategoryAndCountBystoreIdUsingGETPath = '/api/query/findCategoryAndCountBystoreId/{storeId}';
  static readonly findByMobileNumberUsingGETPath = '/api/query/findCustomerByMobileNumber/{mobileNumber}';
  static readonly findOrderLinesByOrderIdUsingGETPath = '/api/query/findOrderLinesByOrderId/{orderId}';
  static readonly findProductByCategoryIdAndUserIdUsingGETPath = '/api/query/findProductByCategoryIdAndUserId/{categoryId}/{userId}';
  static readonly findProductByIdUsingGETPath = '/api/query/findProductById/{id}';
  static readonly findAllProductBySearchTermUsingGETPath = '/api/query/findProductBySearchTerm/{searchTerm}';
  static readonly findProductByStoreIdAndCategoryNameUsingGETPath = '/api/query/findProductByStoreIdAndCategoryName/{userId}/{categoryName}';
  static readonly findRatingReviewByStoreidAndCustomerNameUsingGETPath = '/api/query/findRatingReview/{storeId}';
  static readonly findStockCurrentByProductIdUsingGETPath = '/api/query/findStockCurrentByProductId/{productId}';
  static readonly findStockCurrentByProductNameAndStoreIdUsingGETPath = '/api/query/findStockCurrentByProductNameStoreId/{name}/{storeId}';
  static readonly findStockCurrentByStoreIdAndCategoryIdUsingGETPath = '/api/query/findStockCurrentByStoreIdAndCategoryId/{userId}/{categoryId}';
  static readonly findStoreBySearchTermUsingGETPath = '/api/query/findStore/{searchTerm}';
  static readonly findStoreByIdUsingGETPath = '/api/query/findStoreById/{id}';
  static readonly findStoreByTypeNameUsingGETPath = '/api/query/findStoreByTypeName/{name}';
  static readonly findStoreAndCountUsingGETPath = '/api/query/findStoreTypeAndCount';
  static readonly findNotificationByReceiverIdUsingGETPath = '/api/query/findnotificationbyreceiverid/{receiverId}';
  static readonly findNotificationCountByReceiverIdAndStatusNameUsingGETPath = '/api/query/findnotificationcount/{receiverId}';
  static readonly findAllProductByStoreIdUsingGETPath = '/api/query/findproducts/{storeId}';
  static readonly headerUsingGETPath = '/api/query/header/{searchTerm}';
  static readonly findOrderByDatebetweenAndStoreIdUsingGETPath = '/api/query/order/{from}/{to}/{storeId}';
  static readonly findOrderByOrderIdUsingGETPath = '/api/query/orderByOrderId/{orderId}';
  static readonly findOrderByStatusNameUsingGETPath = '/api/query/orderStatus/{statusName}';
  static readonly findOrdersByCustomerIdUsingGETPath = '/api/query/ordersByCustomerId/{customerId}';
  static readonly findAndSortProductByPriceUsingGETPath = '/api/query/productByPrice/{from}/{to}';
  static readonly findProductUsingGETPath = '/api/query/products/{id}';
  static readonly findRatingByStoreIdUsingGETPath = '/api/query/rating/{storeId}';
  static readonly findRatingByStoreIdAndCustomerNameUsingGETPath = '/api/query/rating/{storeId}/{name}';
  static readonly findRatingByCustomerNameUsingGETPath = '/api/query/ratingByName/{name}';
  static readonly findReviewCountByStoreIdUsingGETPath = '/api/query/review-count';
  static readonly findReviewByStoreIdAndCustomerNameUsingGETPath = '/api/query/review/{storeId}/{name}';
  static readonly findReviewsByStoreIdUsingGETPath = '/api/query/review/{userName}';
  static readonly findAllReviewsUsingGETPath = '/api/query/reviews';
  static readonly findAndSortStoreBydeliveryTimeUsingGETPath = '/api/query/sortStoreByMinAmount';
  static readonly findStockCurrentByCategoryNameAndStoreIdUsingGETPath = '/api/query/stock-current-by-categoryname/{categoryName}/{storeId}';
  static readonly searchStockCurrentsUsingGETPath = '/api/query/stock-current/{searchTerm}';
  static readonly findOneStockCurrentUsingGETPath = '/api/query/stock-currents/{id}';
  static readonly findStockCurrentByStoreIdUsingGETPath = '/api/query/stockcurrent/{storeId}';
  static readonly findStoreTypeByStoreIdUsingGETPath = '/api/query/store-type/{storeId}';
  static readonly findStoreByRegisterNumberUsingGETPath = '/api/query/store/{regNo}';
  static readonly getStoreAddressUsingGETPath = '/api/query/storeAddress/{IDPCode}';
  static readonly findStoreByLocationNameUsingGETPath = '/api/query/storeByLocationName/{locationName}';
  static readonly findStoreByRatingUsingGETPath = '/api/query/storeByRating';
  static readonly getStoreSettingsUsingGETPath = '/api/query/storeSettings/{IDPCode}';
  static readonly findAllStoresUsingGETPath = '/api/query/stores';
  static readonly findStoreBannersUsingGETPath = '/api/query/stores/banners';
  static readonly getAllStoreTypesUsingGETPath = '/api/query/stores/storeTypes';
  static readonly findStoresByDeliveryTypeUsingGETPath = '/api/query/storesByDeliveryType/{deliveryType}';
  static readonly findStoreByStoreTypeUsingGETPath = '/api/query/storesByStoreType/{storeType}';
  static readonly getTaskDetailsUsingGETPath = '/api/query/taskDetails/{taskName}/{orderId}/{storeId}';
  static readonly getTasksUsingGETPath = '/api/query/tasks';
  static readonly findUserRatingByRegNoUsingGETPath = '/api/query/user-rating/{regNo}';
  static readonly findAllUserRatingsUsingGETPath = '/api/query/user-ratings';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param productId productId
   * @return OK
   */
  findAuxilariesByProductIdUsingGETResponse(productId: number): __Observable<__StrictHttpResponse<PageOfAuxilaryLineItem>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/auxilaries-productId/${productId}`,
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
   * @param productId productId
   * @return OK
   */
  findAuxilariesByProductIdUsingGET(productId: number): __Observable<PageOfAuxilaryLineItem> {
    return this.findAuxilariesByProductIdUsingGETResponse(productId).pipe(
      __map(_r => _r.body as PageOfAuxilaryLineItem)
    );
  }

  /**
   * @param productId productId
   * @return OK
   */
  findComboByProductIdUsingGETResponse(productId: number): __Observable<__StrictHttpResponse<PageOfComboLineItem>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/combos-productId/${productId}`,
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
   * @param productId productId
   * @return OK
   */
  findComboByProductIdUsingGET(productId: number): __Observable<PageOfComboLineItem> {
    return this.findComboByProductIdUsingGETResponse(productId).pipe(
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
   * @param reference reference
   * @return OK
   */
  findCustomerByReferenceUsingGETResponse(reference: string): __Observable<__StrictHttpResponse<CustomerDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/customers/findByReference/${reference}`,
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
   * @param reference reference
   * @return OK
   */
  findCustomerByReferenceUsingGET(reference: string): __Observable<CustomerDTO> {
    return this.findCustomerByReferenceUsingGETResponse(reference).pipe(
      __map(_r => _r.body as CustomerDTO)
    );
  }

  /**
   * @param id id
   * @return OK
   */
  findCustomerByIdUsingGETResponse(id: number): __Observable<__StrictHttpResponse<CustomerDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/customers/${id}`,
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
   * @param id id
   * @return OK
   */
  findCustomerByIdUsingGET(id: number): __Observable<CustomerDTO> {
    return this.findCustomerByIdUsingGETResponse(id).pipe(
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
   * @param storeId storeId
   * @return OK
   */
  findDeliveryInfoByStoreIdUsingGETResponse(storeId: string): __Observable<__StrictHttpResponse<PageOfDeliveryInfo>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/deliveryinfoByStoreId/${storeId}`,
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
   * @param storeId storeId
   * @return OK
   */
  findDeliveryInfoByStoreIdUsingGET(storeId: string): __Observable<PageOfDeliveryInfo> {
    return this.findDeliveryInfoByStoreIdUsingGETResponse(storeId).pipe(
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
   * @param params The `QueryResourceService.FindFavouriteProductsByCustomerReferenceUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `reference`: reference
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findFavouriteProductsByCustomerReferenceUsingGETResponse(params: QueryResourceService.FindFavouriteProductsByCustomerReferenceUsingGETParams): __Observable<__StrictHttpResponse<PageOfFavouriteProduct>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.reference != null) __params = __params.set('reference', params.reference.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/favouriteproductsbycustomerreference/${params.reference}`,
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
   * @param params The `QueryResourceService.FindFavouriteProductsByCustomerReferenceUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `reference`: reference
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findFavouriteProductsByCustomerReferenceUsingGET(params: QueryResourceService.FindFavouriteProductsByCustomerReferenceUsingGETParams): __Observable<PageOfFavouriteProduct> {
    return this.findFavouriteProductsByCustomerReferenceUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfFavouriteProduct)
    );
  }

  /**
   * @param params The `QueryResourceService.FindFavouriteStoresByCustomerReferenceUsingGETParams` containing the following parameters:
   *
   * - `reference`: reference
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findFavouriteStoresByCustomerReferenceUsingGETResponse(params: QueryResourceService.FindFavouriteStoresByCustomerReferenceUsingGETParams): __Observable<__StrictHttpResponse<PageOfFavouriteStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/favouritestoresbycustomerreference/${params.reference}`,
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
   * @param params The `QueryResourceService.FindFavouriteStoresByCustomerReferenceUsingGETParams` containing the following parameters:
   *
   * - `reference`: reference
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findFavouriteStoresByCustomerReferenceUsingGET(params: QueryResourceService.FindFavouriteStoresByCustomerReferenceUsingGETParams): __Observable<PageOfFavouriteStore> {
    return this.findFavouriteStoresByCustomerReferenceUsingGETResponse(params).pipe(
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
   * @param params The `QueryResourceService.FindAllCustomersWithoutSearchUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllCustomersWithoutSearchUsingGETResponse(params: QueryResourceService.FindAllCustomersWithoutSearchUsingGETParams): __Observable<__StrictHttpResponse<PageOfCustomer>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findAllCustomers`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfCustomer>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAllCustomersWithoutSearchUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllCustomersWithoutSearchUsingGET(params: QueryResourceService.FindAllCustomersWithoutSearchUsingGETParams): __Observable<PageOfCustomer> {
    return this.findAllCustomersWithoutSearchUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfCustomer)
    );
  }

  /**
   * @param params The `QueryResourceService.FindCategoryAndCountUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findCategoryAndCountUsingGETResponse(params: QueryResourceService.FindCategoryAndCountUsingGETParams): __Observable<__StrictHttpResponse<Array<Entry>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findCategoryAndCount`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Entry>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindCategoryAndCountUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findCategoryAndCountUsingGET(params: QueryResourceService.FindCategoryAndCountUsingGETParams): __Observable<Array<Entry>> {
    return this.findCategoryAndCountUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<Entry>)
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
  findCategoryAndCountBystoreIdUsingGETResponse(params: QueryResourceService.FindCategoryAndCountBystoreIdUsingGETParams): __Observable<__StrictHttpResponse<Array<Entry>>> {
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
        return _r as __StrictHttpResponse<Array<Entry>>;
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
  findCategoryAndCountBystoreIdUsingGET(params: QueryResourceService.FindCategoryAndCountBystoreIdUsingGETParams): __Observable<Array<Entry>> {
    return this.findCategoryAndCountBystoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<Entry>)
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
   * @param orderId orderId
   * @return OK
   */
  findOrderLinesByOrderIdUsingGETResponse(orderId?: number): __Observable<__StrictHttpResponse<Array<OrderLine>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (orderId != null) __params = __params.set('orderId', orderId.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findOrderLinesByOrderId/${orderId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<OrderLine>>;
      })
    );
  }
  /**
   * @param orderId orderId
   * @return OK
   */
  findOrderLinesByOrderIdUsingGET(orderId?: number): __Observable<Array<OrderLine>> {
    return this.findOrderLinesByOrderIdUsingGETResponse(orderId).pipe(
      __map(_r => _r.body as Array<OrderLine>)
    );
  }

  /**
   * @param params The `QueryResourceService.FindProductByCategoryIdAndUserIdUsingGETParams` containing the following parameters:
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
  findProductByCategoryIdAndUserIdUsingGETResponse(params: QueryResourceService.FindProductByCategoryIdAndUserIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfProduct>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findProductByCategoryIdAndUserId/${params.categoryId}/${params.userId}`,
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
   * @param params The `QueryResourceService.FindProductByCategoryIdAndUserIdUsingGETParams` containing the following parameters:
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
  findProductByCategoryIdAndUserIdUsingGET(params: QueryResourceService.FindProductByCategoryIdAndUserIdUsingGETParams): __Observable<PageOfProduct> {
    return this.findProductByCategoryIdAndUserIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfProduct)
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
   * @param params The `QueryResourceService.FindAllProductBySearchTermUsingGETParams` containing the following parameters:
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
  findAllProductBySearchTermUsingGETResponse(params: QueryResourceService.FindAllProductBySearchTermUsingGETParams): __Observable<__StrictHttpResponse<PageOfProduct>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findProductBySearchTerm/${params.searchTerm}`,
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
   * @param params The `QueryResourceService.FindAllProductBySearchTermUsingGETParams` containing the following parameters:
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
  findAllProductBySearchTermUsingGET(params: QueryResourceService.FindAllProductBySearchTermUsingGETParams): __Observable<PageOfProduct> {
    return this.findAllProductBySearchTermUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfProduct)
    );
  }

  /**
   * @param params The `QueryResourceService.FindProductByStoreIdAndCategoryNameUsingGETParams` containing the following parameters:
   *
   * - `userId`: userId
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
  findProductByStoreIdAndCategoryNameUsingGETResponse(params: QueryResourceService.FindProductByStoreIdAndCategoryNameUsingGETParams): __Observable<__StrictHttpResponse<PageOfProduct>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findProductByStoreIdAndCategoryName/${params.userId}/${params.categoryName}`,
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
   * @param params The `QueryResourceService.FindProductByStoreIdAndCategoryNameUsingGETParams` containing the following parameters:
   *
   * - `userId`: userId
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
  findProductByStoreIdAndCategoryNameUsingGET(params: QueryResourceService.FindProductByStoreIdAndCategoryNameUsingGETParams): __Observable<PageOfProduct> {
    return this.findProductByStoreIdAndCategoryNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfProduct)
    );
  }

  /**
   * @param params The `QueryResourceService.FindRatingReviewByStoreidAndCustomerNameUsingGETParams` containing the following parameters:
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
  findRatingReviewByStoreidAndCustomerNameUsingGETResponse(params: QueryResourceService.FindRatingReviewByStoreidAndCustomerNameUsingGETParams): __Observable<__StrictHttpResponse<PageOfRatingReview>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findRatingReview/${params.storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfRatingReview>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindRatingReviewByStoreidAndCustomerNameUsingGETParams` containing the following parameters:
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
  findRatingReviewByStoreidAndCustomerNameUsingGET(params: QueryResourceService.FindRatingReviewByStoreidAndCustomerNameUsingGETParams): __Observable<PageOfRatingReview> {
    return this.findRatingReviewByStoreidAndCustomerNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfRatingReview)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStockCurrentByProductIdUsingGETParams` containing the following parameters:
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
  findStockCurrentByProductIdUsingGETResponse(params: QueryResourceService.FindStockCurrentByProductIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfStockCurrent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findStockCurrentByProductId/${params.productId}`,
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
   * @param params The `QueryResourceService.FindStockCurrentByProductIdUsingGETParams` containing the following parameters:
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
  findStockCurrentByProductIdUsingGET(params: QueryResourceService.FindStockCurrentByProductIdUsingGETParams): __Observable<PageOfStockCurrent> {
    return this.findStockCurrentByProductIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStockCurrent)
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
   * @param params The `QueryResourceService.FindStoreBySearchTermUsingGETParams` containing the following parameters:
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
  findStoreBySearchTermUsingGETResponse(params: QueryResourceService.FindStoreBySearchTermUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findStore/${params.searchTerm}`,
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
   * @param params The `QueryResourceService.FindStoreBySearchTermUsingGETParams` containing the following parameters:
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
  findStoreBySearchTermUsingGET(params: QueryResourceService.FindStoreBySearchTermUsingGETParams): __Observable<PageOfStore> {
    return this.findStoreBySearchTermUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
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
   * @param params The `QueryResourceService.FindStoreByTypeNameUsingGETParams` containing the following parameters:
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
  findStoreByTypeNameUsingGETResponse(params: QueryResourceService.FindStoreByTypeNameUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findStoreByTypeName/${params.name}`,
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
   * @param params The `QueryResourceService.FindStoreByTypeNameUsingGETParams` containing the following parameters:
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
  findStoreByTypeNameUsingGET(params: QueryResourceService.FindStoreByTypeNameUsingGETParams): __Observable<PageOfStore> {
    return this.findStoreByTypeNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStoreAndCountUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreAndCountUsingGETResponse(params: QueryResourceService.FindStoreAndCountUsingGETParams): __Observable<__StrictHttpResponse<Array<Entry>>> {
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
        return _r as __StrictHttpResponse<Array<Entry>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStoreAndCountUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreAndCountUsingGET(params: QueryResourceService.FindStoreAndCountUsingGETParams): __Observable<Array<Entry>> {
    return this.findStoreAndCountUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<Entry>)
    );
  }

  /**
   * @param params The `QueryResourceService.FindNotificationByReceiverIdUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `receiverId`: receiverId
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
    if (params.receiverId != null) __params = __params.set('receiverId', params.receiverId.toString());
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
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `receiverId`: receiverId
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
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `receiverId`: receiverId
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findNotificationCountByReceiverIdAndStatusNameUsingGETResponse(params: QueryResourceService.FindNotificationCountByReceiverIdAndStatusNameUsingGETParams): __Observable<__StrictHttpResponse<PageOfNotification>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.receiverId != null) __params = __params.set('receiverId', params.receiverId.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findnotificationcount/${params.receiverId}`,
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
   * @param params The `QueryResourceService.FindNotificationCountByReceiverIdAndStatusNameUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `receiverId`: receiverId
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findNotificationCountByReceiverIdAndStatusNameUsingGET(params: QueryResourceService.FindNotificationCountByReceiverIdAndStatusNameUsingGETParams): __Observable<PageOfNotification> {
    return this.findNotificationCountByReceiverIdAndStatusNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfNotification)
    );
  }

  /**
   * @param storeId storeId
   * @return OK
   */
  findAllProductByStoreIdUsingGETResponse(storeId: string): __Observable<__StrictHttpResponse<PageOfProduct>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/findproducts/${storeId}`,
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
   * @param storeId storeId
   * @return OK
   */
  findAllProductByStoreIdUsingGET(storeId: string): __Observable<PageOfProduct> {
    return this.findAllProductByStoreIdUsingGETResponse(storeId).pipe(
      __map(_r => _r.body as PageOfProduct)
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
   * @return OK
   */
  findOrderByDatebetweenAndStoreIdUsingGETResponse(params: QueryResourceService.FindOrderByDatebetweenAndStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfOrder>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



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
   * @return OK
   */
  findAndSortProductByPriceUsingGETResponse(params: QueryResourceService.FindAndSortProductByPriceUsingGETParams): __Observable<__StrictHttpResponse<PageOfStockCurrent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


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
   * @param storeId storeId
   * @return OK
   */
  findRatingByStoreIdUsingGETResponse(storeId: string): __Observable<__StrictHttpResponse<UserRating>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/rating/${storeId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserRating>;
      })
    );
  }
  /**
   * @param storeId storeId
   * @return OK
   */
  findRatingByStoreIdUsingGET(storeId: string): __Observable<UserRating> {
    return this.findRatingByStoreIdUsingGETResponse(storeId).pipe(
      __map(_r => _r.body as UserRating)
    );
  }

  /**
   * @param params The `QueryResourceService.FindRatingByStoreIdAndCustomerNameUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `name`: name
   *
   * @return OK
   */
  findRatingByStoreIdAndCustomerNameUsingGETResponse(params: QueryResourceService.FindRatingByStoreIdAndCustomerNameUsingGETParams): __Observable<__StrictHttpResponse<UserRating>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/rating/${params.storeId}/${params.name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserRating>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindRatingByStoreIdAndCustomerNameUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `name`: name
   *
   * @return OK
   */
  findRatingByStoreIdAndCustomerNameUsingGET(params: QueryResourceService.FindRatingByStoreIdAndCustomerNameUsingGETParams): __Observable<UserRating> {
    return this.findRatingByStoreIdAndCustomerNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as UserRating)
    );
  }

  /**
   * @param name name
   * @return OK
   */
  findRatingByCustomerNameUsingGETResponse(name: string): __Observable<__StrictHttpResponse<UserRating>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/ratingByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserRating>;
      })
    );
  }
  /**
   * @param name name
   * @return OK
   */
  findRatingByCustomerNameUsingGET(name: string): __Observable<UserRating> {
    return this.findRatingByCustomerNameUsingGETResponse(name).pipe(
      __map(_r => _r.body as UserRating)
    );
  }

  /**
   * @param storeId storeId
   * @return OK
   */
  findReviewCountByStoreIdUsingGETResponse(storeId?: string): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (storeId != null) __params = __params.set('storeId', storeId.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/review-count`,
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
   * @param storeId storeId
   * @return OK
   */
  findReviewCountByStoreIdUsingGET(storeId?: string): __Observable<number> {
    return this.findReviewCountByStoreIdUsingGETResponse(storeId).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `QueryResourceService.FindReviewByStoreIdAndCustomerNameUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `name`: name
   *
   * @return OK
   */
  findReviewByStoreIdAndCustomerNameUsingGETResponse(params: QueryResourceService.FindReviewByStoreIdAndCustomerNameUsingGETParams): __Observable<__StrictHttpResponse<Review>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/review/${params.storeId}/${params.name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Review>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindReviewByStoreIdAndCustomerNameUsingGETParams` containing the following parameters:
   *
   * - `storeId`: storeId
   *
   * - `name`: name
   *
   * @return OK
   */
  findReviewByStoreIdAndCustomerNameUsingGET(params: QueryResourceService.FindReviewByStoreIdAndCustomerNameUsingGETParams): __Observable<Review> {
    return this.findReviewByStoreIdAndCustomerNameUsingGETResponse(params).pipe(
      __map(_r => _r.body as Review)
    );
  }

  /**
   * @param userName userName
   * @return OK
   */
  findReviewsByStoreIdUsingGETResponse(userName: string): __Observable<__StrictHttpResponse<PageOfReview>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/review/${userName}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfReview>;
      })
    );
  }
  /**
   * @param userName userName
   * @return OK
   */
  findReviewsByStoreIdUsingGET(userName: string): __Observable<PageOfReview> {
    return this.findReviewsByStoreIdUsingGETResponse(userName).pipe(
      __map(_r => _r.body as PageOfReview)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAllReviewsUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllReviewsUsingGETResponse(params: QueryResourceService.FindAllReviewsUsingGETParams): __Observable<__StrictHttpResponse<PageOfReview>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/reviews`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfReview>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAllReviewsUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllReviewsUsingGET(params: QueryResourceService.FindAllReviewsUsingGETParams): __Observable<PageOfReview> {
    return this.findAllReviewsUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfReview)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAndSortStoreBydeliveryTimeUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAndSortStoreBydeliveryTimeUsingGETResponse(params: QueryResourceService.FindAndSortStoreBydeliveryTimeUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
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
   * @param params The `QueryResourceService.FindAndSortStoreBydeliveryTimeUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAndSortStoreBydeliveryTimeUsingGET(params: QueryResourceService.FindAndSortStoreBydeliveryTimeUsingGETParams): __Observable<PageOfStore> {
    return this.findAndSortStoreBydeliveryTimeUsingGETResponse(params).pipe(
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
   * @return OK
   */
  findStockCurrentByCategoryNameAndStoreIdUsingGETResponse(params: QueryResourceService.FindStockCurrentByCategoryNameAndStoreIdUsingGETParams): __Observable<__StrictHttpResponse<PageOfStockCurrent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


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
   * @return OK
   */
  findStockCurrentByCategoryNameAndStoreIdUsingGET(params: QueryResourceService.FindStockCurrentByCategoryNameAndStoreIdUsingGETParams): __Observable<PageOfStockCurrent> {
    return this.findStockCurrentByCategoryNameAndStoreIdUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStockCurrent)
    );
  }

  /**
   * @param params The `QueryResourceService.SearchStockCurrentsUsingGETParams` containing the following parameters:
   *
   * - `searchTerm`: searchTerm
   *
   * - `sort`: sort
   *
   * - `size`: size
   *
   * - `page`: page
   *
   * @return OK
   */
  searchStockCurrentsUsingGETResponse(params: QueryResourceService.SearchStockCurrentsUsingGETParams): __Observable<__StrictHttpResponse<Array<StockCurrentDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/stock-current/${params.searchTerm}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<StockCurrentDTO>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.SearchStockCurrentsUsingGETParams` containing the following parameters:
   *
   * - `searchTerm`: searchTerm
   *
   * - `sort`: sort
   *
   * - `size`: size
   *
   * - `page`: page
   *
   * @return OK
   */
  searchStockCurrentsUsingGET(params: QueryResourceService.SearchStockCurrentsUsingGETParams): __Observable<Array<StockCurrentDTO>> {
    return this.searchStockCurrentsUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<StockCurrentDTO>)
    );
  }

  /**
   * @param id id
   * @return OK
   */
  findOneStockCurrentUsingGETResponse(id: number): __Observable<__StrictHttpResponse<StockCurrentDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/stock-currents/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<StockCurrentDTO>;
      })
    );
  }
  /**
   * @param id id
   * @return OK
   */
  findOneStockCurrentUsingGET(id: number): __Observable<StockCurrentDTO> {
    return this.findOneStockCurrentUsingGETResponse(id).pipe(
      __map(_r => _r.body as StockCurrentDTO)
    );
  }

  /**
   * @param storeId storeId
   * @return OK
   */
  findStockCurrentByStoreIdUsingGETResponse(storeId: string): __Observable<__StrictHttpResponse<PageOfStockCurrent>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/stockcurrent/${storeId}`,
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
   * @param storeId storeId
   * @return OK
   */
  findStockCurrentByStoreIdUsingGET(storeId: string): __Observable<PageOfStockCurrent> {
    return this.findStockCurrentByStoreIdUsingGETResponse(storeId).pipe(
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
   * @param locationName locationName
   * @return OK
   */
  findStoreByLocationNameUsingGETResponse(locationName: string): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/storeByLocationName/${locationName}`,
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
   * @param locationName locationName
   * @return OK
   */
  findStoreByLocationNameUsingGET(locationName: string): __Observable<PageOfStore> {
    return this.findStoreByLocationNameUsingGETResponse(locationName).pipe(
      __map(_r => _r.body as PageOfStore)
    );
  }

  /**
   * @return OK
   */
  findStoreByRatingUsingGETResponse(): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
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
   * @return OK
   */
  findStoreByRatingUsingGET(): __Observable<PageOfStore> {
    return this.findStoreByRatingUsingGETResponse().pipe(
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
   * @param params The `QueryResourceService.FindStoreBannersUsingGETParams` containing the following parameters:
   *
   * - `sort`: sort
   *
   * - `size`: size
   *
   * - `page`: page
   *
   * @return OK
   */
  findStoreBannersUsingGETResponse(params: QueryResourceService.FindStoreBannersUsingGETParams): __Observable<__StrictHttpResponse<Array<BannerDTO>>> {
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
        return _r as __StrictHttpResponse<Array<BannerDTO>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindStoreBannersUsingGETParams` containing the following parameters:
   *
   * - `sort`: sort
   *
   * - `size`: size
   *
   * - `page`: page
   *
   * @return OK
   */
  findStoreBannersUsingGET(params: QueryResourceService.FindStoreBannersUsingGETParams): __Observable<Array<BannerDTO>> {
    return this.findStoreBannersUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<BannerDTO>)
    );
  }

  /**
   * @param params The `QueryResourceService.GetAllStoreTypesUsingGETParams` containing the following parameters:
   *
   * - `sort`: sort
   *
   * - `size`: size
   *
   * - `page`: page
   *
   * @return OK
   */
  getAllStoreTypesUsingGETResponse(params: QueryResourceService.GetAllStoreTypesUsingGETParams): __Observable<__StrictHttpResponse<Array<StoreTypeDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/stores/storeTypes`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<StoreTypeDTO>>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.GetAllStoreTypesUsingGETParams` containing the following parameters:
   *
   * - `sort`: sort
   *
   * - `size`: size
   *
   * - `page`: page
   *
   * @return OK
   */
  getAllStoreTypesUsingGET(params: QueryResourceService.GetAllStoreTypesUsingGETParams): __Observable<Array<StoreTypeDTO>> {
    return this.getAllStoreTypesUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<StoreTypeDTO>)
    );
  }

  /**
   * @param deliveryType deliveryType
   * @return OK
   */
  findStoresByDeliveryTypeUsingGETResponse(deliveryType: string): __Observable<__StrictHttpResponse<Array<Store>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/storesByDeliveryType/${deliveryType}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Store>>;
      })
    );
  }
  /**
   * @param deliveryType deliveryType
   * @return OK
   */
  findStoresByDeliveryTypeUsingGET(deliveryType: string): __Observable<Array<Store>> {
    return this.findStoresByDeliveryTypeUsingGETResponse(deliveryType).pipe(
      __map(_r => _r.body as Array<Store>)
    );
  }

  /**
   * @param params The `QueryResourceService.FindStoreByStoreTypeUsingGETParams` containing the following parameters:
   *
   * - `storeType`: storeType
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreByStoreTypeUsingGETResponse(params: QueryResourceService.FindStoreByStoreTypeUsingGETParams): __Observable<__StrictHttpResponse<PageOfStore>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/storesByStoreType/${params.storeType}`,
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
   * @param params The `QueryResourceService.FindStoreByStoreTypeUsingGETParams` containing the following parameters:
   *
   * - `storeType`: storeType
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findStoreByStoreTypeUsingGET(params: QueryResourceService.FindStoreByStoreTypeUsingGETParams): __Observable<PageOfStore> {
    return this.findStoreByStoreTypeUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfStore)
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

  /**
   * @param regNo regNo
   * @return OK
   */
  findUserRatingByRegNoUsingGETResponse(regNo: string): __Observable<__StrictHttpResponse<PageOfUserRating>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/user-rating/${regNo}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfUserRating>;
      })
    );
  }
  /**
   * @param regNo regNo
   * @return OK
   */
  findUserRatingByRegNoUsingGET(regNo: string): __Observable<PageOfUserRating> {
    return this.findUserRatingByRegNoUsingGETResponse(regNo).pipe(
      __map(_r => _r.body as PageOfUserRating)
    );
  }

  /**
   * @param params The `QueryResourceService.FindAllUserRatingsUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllUserRatingsUsingGETResponse(params: QueryResourceService.FindAllUserRatingsUsingGETParams): __Observable<__StrictHttpResponse<PageOfUserRating>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/query/user-ratings`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PageOfUserRating>;
      })
    );
  }
  /**
   * @param params The `QueryResourceService.FindAllUserRatingsUsingGETParams` containing the following parameters:
   *
   * - `sort`: Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   *
   * - `size`: Size of a page
   *
   * - `page`: Page number of the requested page
   *
   * @return OK
   */
  findAllUserRatingsUsingGET(params: QueryResourceService.FindAllUserRatingsUsingGETParams): __Observable<PageOfUserRating> {
    return this.findAllUserRatingsUsingGETResponse(params).pipe(
      __map(_r => _r.body as PageOfUserRating)
    );
  }
}

module QueryResourceService {

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
   * Parameters for findFavouriteProductsByCustomerReferenceUsingGET
   */
  export interface FindFavouriteProductsByCustomerReferenceUsingGETParams {

    /**
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;

    /**
     * Size of a page
     */
    size?: number;

    /**
     * reference
     */
    reference?: string;

    /**
     * Page number of the requested page
     */
    page?: number;
  }

  /**
   * Parameters for findFavouriteStoresByCustomerReferenceUsingGET
   */
  export interface FindFavouriteStoresByCustomerReferenceUsingGETParams {

    /**
     * reference
     */
    reference: string;

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
   * Parameters for findAllCustomersWithoutSearchUsingGET
   */
  export interface FindAllCustomersWithoutSearchUsingGETParams {

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
   * Parameters for findCategoryAndCountUsingGET
   */
  export interface FindCategoryAndCountUsingGETParams {

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
   * Parameters for findProductByCategoryIdAndUserIdUsingGET
   */
  export interface FindProductByCategoryIdAndUserIdUsingGETParams {

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
   * Parameters for findAllProductBySearchTermUsingGET
   */
  export interface FindAllProductBySearchTermUsingGETParams {

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
   * Parameters for findProductByStoreIdAndCategoryNameUsingGET
   */
  export interface FindProductByStoreIdAndCategoryNameUsingGETParams {

    /**
     * userId
     */
    userId: string;

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
   * Parameters for findRatingReviewByStoreidAndCustomerNameUsingGET
   */
  export interface FindRatingReviewByStoreidAndCustomerNameUsingGETParams {

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
   * Parameters for findStockCurrentByProductIdUsingGET
   */
  export interface FindStockCurrentByProductIdUsingGETParams {

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
   * Parameters for findStoreBySearchTermUsingGET
   */
  export interface FindStoreBySearchTermUsingGETParams {

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
   * Parameters for findStoreByTypeNameUsingGET
   */
  export interface FindStoreByTypeNameUsingGETParams {

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
   * Parameters for findStoreAndCountUsingGET
   */
  export interface FindStoreAndCountUsingGETParams {

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
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;

    /**
     * Size of a page
     */
    size?: number;

    /**
     * receiverId
     */
    receiverId?: string;

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
     * Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    sort?: Array<string>;

    /**
     * Size of a page
     */
    size?: number;

    /**
     * receiverId
     */
    receiverId?: string;

    /**
     * Page number of the requested page
     */
    page?: number;
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
  }

  /**
   * Parameters for findRatingByStoreIdAndCustomerNameUsingGET
   */
  export interface FindRatingByStoreIdAndCustomerNameUsingGETParams {

    /**
     * storeId
     */
    storeId: string;

    /**
     * name
     */
    name: string;
  }

  /**
   * Parameters for findReviewByStoreIdAndCustomerNameUsingGET
   */
  export interface FindReviewByStoreIdAndCustomerNameUsingGETParams {

    /**
     * storeId
     */
    storeId: string;

    /**
     * name
     */
    name: string;
  }

  /**
   * Parameters for findAllReviewsUsingGET
   */
  export interface FindAllReviewsUsingGETParams {

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
   * Parameters for findAndSortStoreBydeliveryTimeUsingGET
   */
  export interface FindAndSortStoreBydeliveryTimeUsingGETParams {

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
  }

  /**
   * Parameters for searchStockCurrentsUsingGET
   */
  export interface SearchStockCurrentsUsingGETParams {

    /**
     * searchTerm
     */
    searchTerm: string;

    /**
     * sort
     */
    sort?: Array<string>;

    /**
     * size
     */
    size?: number;

    /**
     * page
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
   * Parameters for findStoreBannersUsingGET
   */
  export interface FindStoreBannersUsingGETParams {

    /**
     * sort
     */
    sort?: Array<string>;

    /**
     * size
     */
    size?: number;

    /**
     * page
     */
    page?: number;
  }

  /**
   * Parameters for getAllStoreTypesUsingGET
   */
  export interface GetAllStoreTypesUsingGETParams {

    /**
     * sort
     */
    sort?: Array<string>;

    /**
     * size
     */
    size?: number;

    /**
     * page
     */
    page?: number;
  }

  /**
   * Parameters for findStoreByStoreTypeUsingGET
   */
  export interface FindStoreByStoreTypeUsingGETParams {

    /**
     * storeType
     */
    storeType: string;

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

  /**
   * Parameters for findAllUserRatingsUsingGET
   */
  export interface FindAllUserRatingsUsingGETParams {

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
}

export { QueryResourceService }
