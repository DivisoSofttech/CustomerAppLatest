import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { CommandResourceService } from '../api/services';
import { CommandResource, Order, DeliveryInfo, Offer } from '../api/models';
import { NGXLogger } from 'ngx-logger';
import { Util } from './util';
import { BehaviorSubject } from 'rxjs';
import { KeycloakService } from './security/keycloak.service';
import { DecimalPipe } from '@angular/common';
import { NoCommaPipe } from '../pipes/no-comma.pipe';
import { KeycloakUser } from '../models/keycloak-user';

@Injectable({
  providedIn: 'root'
})
export class OrderService implements OnInit , OnDestroy {

  order: Order ;
  resource: CommandResource = {};
  orderResourceBehaviour: BehaviorSubject<string> = new BehaviorSubject(this.resource.nextTaskName);
  deliveryInfo: DeliveryInfo = {};
  user: KeycloakUser;
  paymentMethod;
  acceptType = 'automatic';
  shop;
  offer: Offer;
  keycloakSubscription: any;
  constructor(
    private commandResourceService: CommandResourceService,
    private logger: NGXLogger,
    private util: Util,
    private keycloakService: KeycloakService,
    private decimalPipe: DecimalPipe,
    private noCommaPipe: NoCommaPipe
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

  updateLoyaltyPoint() {
    this.commandResourceService.updateLoyaltyPointUsingPOST({
      point: 1,
      idpCode: this.user.preferred_username,
      orderId: this.order.orderId
    }).subscribe(data => {
      this.logger.info(this,'Loyality Point Success');      
    })
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
        this.user = data;
      })
    });
  }

  collectDeliveryInfo() {
    this.logger.info('DeliveryInfo is' + this.deliveryInfo);
    return this.commandResourceService.collectDeliveryDetailsUsingPOST(
      { taskId: this.resource.nextTaskId, orderId: this.resource.orderId, deliveryInfo: this.deliveryInfo });
  }

  async claimMyOffer(totalPrice) {
    if (!this.user) {
      await this.getCustomer();
    }
    return this.commandResourceService.checkOfferEligibilityUsingPOST({
      orderModel: {
        orderTotal: totalPrice
      }, customerId: this.user.preferred_username
    });
  }

  processPayment(ref: string, status: string, provider) {
    if (!this.user) {
      this.getCustomer();
    }
    console.log('Payment reference is ' + ref);
    return this.commandResourceService.processPaymentUsingPOST(
      {
        taskId: this.resource.nextTaskId,
        status, paymentDTO: {
          amount: this.order.grandTotal,
          payee: this.order.storeId,
          payer: this.user.preferred_username,
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
    order.grandTotal = this.noCommaPipe.transform(order.grandTotal);
    order.subTotal = this.noCommaPipe.transform(order.subTotal);
    this.order = order;
  }

  setShop(shop) {
    this.shop = shop;
  }

  setCustomer(customer) {
    this.user = customer;
  }

  setNote(note) {
    this.deliveryInfo.deliveryNotes = note;
  }
}
