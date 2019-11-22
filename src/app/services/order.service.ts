import { CartService } from 'src/app/services/cart.service';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { OrderCommandResourceService, OfferCommandResourceService, PaymentCommandResourceService } from '../api/services';
import { CommandResource, Order, DeliveryInfo, Address, Offer } from '../api/models';
import { Storage } from '@ionic/storage';
import { NGXLogger } from 'ngx-logger';
import { Util } from './util';
import { PaymentSuccessfullInfoComponent } from '../components/payment-successfull-info/payment-successfull-info.component';
import { ModalController } from '@ionic/angular';
import { MakePaymentComponent } from '../components/make-payment/make-payment.component';
import { BehaviorSubject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { SharedDataService } from './shared-data.service';
import { KeycloakService } from './security/keycloak.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService implements OnInit , OnDestroy {

  order: Order ;
  resource: CommandResource = {};
  orderResourceBehaviour: BehaviorSubject<string> = new BehaviorSubject(this.resource.nextTaskName);
  deliveryInfo: DeliveryInfo = {};
  customer;
  paymentMethod;
  acceptType = 'automatic';
  shop;
  offer: Offer;
  keycloakSubscription: any;
  constructor(
    private orderCommandService: OrderCommandResourceService,
    private storage: Storage,
    private cart: CartService,
    private logger: NGXLogger,
    private oauthService: OAuthService,
    private offerCommandService: OfferCommandResourceService,
    private paymentCommandService: PaymentCommandResourceService,
    private util: Util,
    private sharedData: SharedDataService,
    private keycloakService: KeycloakService
  ) {
    this.getCustomer();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.keycloakSubscription.unsubscribe();
  }

  isTask(taskName: string): boolean {
    return this.resource.nextTaskName === taskName;
  }

  initiateOrder() {
    if (this.offer !== undefined) {
      this.order.appliedOffers.push(this.offer);
    }
    return this.orderCommandService.initiateOrderUsingPOST(this.order);
  }

  async getCustomer() {
    await this.util.createLoader().then(async loader => {
      // loader.dismiss();
      // if (this.oauthService.hasValidAccessToken()) {
      //   await this.storage.get('user')
      //     .then(data => {
      //       this.customer = data;
      //       this.logger.info('Got Customer ', data);
      //       loader.dismiss();
      //     });
      // }
      this.keycloakSubscription = this.keycloakService.getUserChangedSubscription()
      .subscribe(data => {
        this.customer = data;
      })
    });
  }

  collectDeliveryInfo() {
    this.logger.info('DeliveryInfo is' + this.deliveryInfo);
    return this.orderCommandService.collectDeliveryDetailsUsingPOST(
      { taskId: this.resource.nextTaskId, orderId: this.resource.orderId, deliveryInfo: this.deliveryInfo });
  }

  async claimMyOffer(totalPrice) {
    if (!this.customer) {
      await this.getCustomer();
    }
    return this.offerCommandService.checkOfferEligibilityUsingPOST({
      orderModel: {
        orderTotal: totalPrice
      }, customerId: this.customer.preferred_username
    });
  }

  processPayment(ref: string, status: string, provider) {
    if (!this.customer) {
      this.getCustomer();
    }
    console.log('Payment reference is ' + ref);
    return this.paymentCommandService.processPaymentUsingPOST(
      {
        taskId: this.resource.nextTaskId,
        status, paymentDTO: {
          amount: this.order.grandTotal,
          payee: this.order.storeId,
          payer: this.customer.preferred_username,
          paymentType: this.paymentMethod,
          provider,
          status,
          targetId: this.order.orderId,
          total: this.order.grandTotal,
          ref
        }
      }
    );

  }

  createOrderRazorPay() {
    return this.paymentCommandService
      .createOrderUsingPOST({
        amount: this.order.grandTotal,
        currency: 'INR',
        payment_capture: 1,
        receipt: 'receipt12340'
      });
  }

  deleteOrderLine(orderLineId) {
    this.logger.info('Entering into deleteOrderLine with id ', orderLineId);
    return this.orderCommandService.deleteOrderLineUsingDELETE(orderLineId);
  }
  initiatePaypalPayment() {
    return this.paymentCommandService.initiatePaymentUsingPOST({
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      transactions: [
        {
          amount: {
            total: Math.round(this.order.grandTotal) + '',
            currency: 'EUR',
            details: {}
          }
        }
      ],
      note_to_payer: 'Contact us for any queries',
      redirect_urls: {
        return_url: 'www.divisosofttech.com',
        cancel_url: 'www.divisosofttech.com'
      }
    });
  }

  createBraintreeClientAuthToken() {
    return this.paymentCommandService.createClientAuthTokenUsingGET();
  }

  createBraintreeTransaction(payload) {
    return this.paymentCommandService.createTransactionUsingPOST({
      nounce: payload.nonce,
      customerId: payload.customerId,
      amount: Math.round(this.order.grandTotal)
    });
  }

  updateOrder(order: Order) {
    return this.orderCommandService.editOrderUsingPUT(order);
  }

  updateDeliveryInfo() {
    return this.orderCommandService.editDeliveryInfoUsingPUT(this.deliveryInfo);
  }
  setResource(resource: CommandResource) {
    if (resource.nextTaskName === 'Collect Delivery Info&Place Order') {
      this.order.id = resource.selfId;
      this.order.orderId = resource.orderId;
    } else if (resource.nextTaskName === 'Process Payment') {
      this.deliveryInfo.id = resource.selfId;
    }
    this.resource = resource;
  }

  setDeliveryType(deliveryType) {
    this.deliveryInfo.deliveryType = deliveryType;
  }

  setOffer(offer: Offer) {
    this.offer = offer;
  }

  setDeliveryCharge(deliveryCharge) {
    this.deliveryInfo.deliveryCharge = deliveryCharge;
  }
  setAddress(address) {
    this.deliveryInfo.deliveryAddress = address;
  }

  setOrder(order) {
    this.order = order;
  }

  setShop(shop) {
    this.shop = shop;
  }

  setCustomer(customer) {
    this.customer = customer;
  }

  setNote(note) {
    this.deliveryInfo.deliveryNotes = note;
  }
}
