import { CartService } from 'src/app/services/cart.service';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { CommandResourceService } from '../api/services';
import { CommandResource, Order, DeliveryInfo, Offer } from '../api/models';
import { Storage } from '@ionic/storage';
import { NGXLogger } from 'ngx-logger';
import { Util } from './util';
import { BehaviorSubject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { SharedDataService } from './shared-data.service';
import { KeycloakService } from './security/keycloak.service';
import { DecimalPipe } from '@angular/common';

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
    private commandResourceService: CommandResourceService,
    private storage: Storage,
    private cart: CartService,
    private logger: NGXLogger,
    private oauthService: OAuthService,
    private util: Util,
    private sharedData: SharedDataService,
    private keycloakService: KeycloakService,
    private decimalPipe: DecimalPipe,
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
    return this.commandResourceService.initiateOrderUsingPOST(this.order);
  }

  async getCustomer() {
    await this.util.createLoader().then(async loader => {
      this.keycloakSubscription = this.keycloakService.getUserChangedSubscription()
      .subscribe(data => {
        this.customer = data;
      })
    });
  }

  collectDeliveryInfo() {
    this.logger.info('DeliveryInfo is' + this.deliveryInfo);
    return this.commandResourceService.collectDeliveryDetailsUsingPOST(
      { taskId: this.resource.nextTaskId, orderId: this.resource.orderId, deliveryInfo: this.deliveryInfo });
  }

  async claimMyOffer(totalPrice) {
    if (!this.customer) {
      await this.getCustomer();
    }
    return this.commandResourceService.checkOfferEligibilityUsingPOST({
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
    return this.commandResourceService.processPaymentUsingPOST(
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
    return this.commandResourceService
      .createOrderUsingPOST({
        amount: this.order.grandTotal * 100,
        currency: 'EUR',
        payment_capture: 1,
        receipt: 'fpreceipt' + this.order.orderId
      });
  }

  deleteOrderLine(orderLineId) {
    this.logger.info('Entering into deleteOrderLine with id ', orderLineId);
    return this.commandResourceService.deleteOrderLineUsingDELETE(orderLineId);
  }

  deleteAuxilaryOrderLine(auxilaryOrderLineId) {
    this.logger.info('Entering into delete auxilary with id ', auxilaryOrderLineId);
    return this.commandResourceService.deleteAuxilaryOrderLineUsingDELETE(auxilaryOrderLineId);
  }
  
  initiatePaypalPayment() {
    return this.commandResourceService.initiatePaymentUsingPOST({
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
    return this.commandResourceService.createClientAuthTokenUsingGET();
  }

  createBraintreeTransaction(payload) {
    return this.commandResourceService.createTransactionUsingPOST({
      nounce: payload.nonce,
      customerId: payload.customerId,
      amount: Math.round(this.order.grandTotal)
    });
  }

  updateOrder(order: Order) {
    return this.commandResourceService.editOrderUsingPUT(order);
  }

  updateDeliveryInfo() {
    return this.commandResourceService.editDeliveryInfoUsingPUT(this.deliveryInfo);
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
    order.grandTotal = this.decimalPipe.transform(Number(order.grandTotal), '1.2-2');
    order.subTotal = this.decimalPipe.transform(Number(order.subTotal), '1.2-2');
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
