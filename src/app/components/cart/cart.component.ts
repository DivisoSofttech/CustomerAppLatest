import { NGXLogger } from 'ngx-logger';
import { DeliveryItemDetailsComponent } from './../delivery-item-details/delivery-item-details.component';
import { Order } from './../../api/models/order';
import { AllergyComponent } from './../allergy/allergy.component';
import { CartService } from './../../services/cart.service';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { OrderLine, Store, StoreSettings, Status } from 'src/app/api/models';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { OrderService } from 'src/app/services/order.service';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { Subscription} from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { PreorderComponent } from '../preorder/preorder.component';
import { ClosedPipe } from 'src/app/pipes/closed.pipe';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  @Input() viewType = 'minimal';

  @Input() store: Store;

  shopRegNo: string;

  guest = true;

  currentSegment = 'delivery';

  cartSize = 0;
  date: Date;
  subTotal = 0.0;

  orderLines: OrderLine[] = [];

  orderLinesUpdated: OrderLine[] = [];

  selectedAddress;

  note = '';

  customer;

  allergyNote;

  neededCheckOutAmount = 0;

  storeSetting: StoreSettings;
  deliveryOk = false;
  collectionOk = false;
  defaultDelivery = false;

  initiateOrderSubcription: Subscription;

  keycloakSubscription: Subscription;

  @Output() viewClick = new EventEmitter();


  @ViewChild(DeliveryItemDetailsComponent, null) delivery: DeliveryItemDetailsComponent;
  deliveryMode: any;

  constructor(
    private cart: CartService,
    private orderService: OrderService,
    private keycloakService: KeycloakService,
    private modalController: ModalController,
    private navController: NavController,
    private logger: NGXLogger,
    private util: Util,
    private decimalPipe: DecimalPipe,
    private popoverController: PopoverController,
    private closedPipe: ClosedPipe,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.date = new Date();
    this.getCartDetails();
    this.getCustomer();
    if (this.viewType === 'full') {
      this.cart.behaviourDeliveryTypes.subscribe(data => {
        if (data !== undefined) {
          this.checkDeliveryTypeExists();
        }
      });
    }
  }

  ngOnDestroy() {
    console.log('Cart ngDestroy calls');
    if (this.initiateOrderSubcription !== undefined) {
      this.initiateOrderSubcription.unsubscribe();
    }
    this.keycloakSubscription !== undefined
      ? this.keycloakSubscription.unsubscribe()
      : null;
  }

  routeBasket() {
    this.logger.info('Firing event');
    this.loginModal(
      () => {
        this.logger.info('Emitting View Click');
        this.viewClick.emit();
      },
      () => {}
    );
  }

  async loginModal(success, error) {
    this.logger.info('CartComponent Login Modal');
    if (this.guest === true) {
      const modal = await this.modalController.create({
        component: LoginSignupComponent,
        componentProps: { type: 'modal' }
      });
      modal.present();
      modal.onDidDismiss().then(data => {
        if (data.data) {
          success();
          this.getCustomer();
        } else {
          error();
        }
      });
    } else {
      success();
    }
  }

  getCustomer() {
    this.util.createLoader().then(loader => {
      this.keycloakSubscription = this.keycloakService
        .getUserChangedSubscription()
        .subscribe(user => {
          this.customer = user;
          if (user === null || user.preferred_username === 'guest') {
            this.guest = true;
            if (this.viewType === 'full') {
              this.loginModal(
                () => {},
                () => {
                  this.keycloakSubscription.unsubscribe();
                  this.navController.back();
                }
              );
            }
          } else {
            this.guest = false;
          }
          if (this.keycloakSubscription !== undefined) {
            this.keycloakSubscription.unsubscribe();
          }
        });
    });
  }

  checkDeliveryTypeExists() {
    this.cart.behaviourDeliveryTypes.subscribe(currentDeliveryTypes => {
      if (currentDeliveryTypes !== undefined) {
        if (currentDeliveryTypes.length === 1) {
          if (currentDeliveryTypes[0].name === 'delivery') {
            this.deliveryOk = true;
            this.currentSegment = 'delivery';
            this.defaultDelivery = true;
            this.deliveryMode = 'delivery';
          } else if (currentDeliveryTypes[0].name === 'collection') {
            this.collectionOk = true;
            this.currentSegment = 'collection';
            this.deliveryMode = 'collection';
          }
        } else {
          this.defaultDelivery = true;
          this.deliveryOk = true;
          this.collectionOk = true;
          this.deliveryMode = 'delivery';
        }
      } else {
        if (this.cart.currentShop !== undefined) {
          this.cart.getStoreSettings();
        }
      }
    });
  }

  getCartDetails() {
    this.cart.observableTickets.subscribe(data => {
      this.cartSize = data.length;
      this.subTotal = this.cart.subTotal;
      this.orderLines = data;
      this.storeSetting = this.cart.currentShopSetting;
      this.store = this.cart.currentShop;
      if (this.store !== undefined && this.store.minAmount > this.subTotal) {
        this.neededCheckOutAmount = this.store.minAmount - this.subTotal;
      } else {
        this.neededCheckOutAmount = 0;
      }
    });
  }

  async presentAllergyModal() {
    const modal = await this.modalController.create({
      component: AllergyComponent,
      componentProps: { store: this.store },
      cssClass: 'modal-popover'
    });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(data.data);
      this.allergyNote = data.data;
    });
  }

  async preorderPopover(callback?) {
    const popover = await this.popoverController.create({
      component: PreorderComponent,
      translucent: false,
      backdropDismiss: false
    });

    popover.onDidDismiss()
    .then(() => {
      callback();
    }); 
    await popover.present();
  }

  checkRestaurantStatus(deliveryType) {
    if (!this.closedPipe.transform(new Date() , this.store.openingTime , this.store.closingTime)) {
      this.preorderPopover(() => {
        this.continue(deliveryType);
      });
     } else {
       this.continue(deliveryType);
     }
  }

  continue(deliveryType) {
    this.logger.info('In Continue');
    this.orderService.setShop(this.store);
    this.orderService.setDeliveryType(deliveryType);
    this.orderService.setDeliveryCharge(this.storeSetting.deliveryCharge);
    this.loginModal(
      () => {
        if (this.orderService.resource.nextTaskName === undefined) {
          this.logger.info('creating new order >>>>>>>>>>>>>');
          const order: Order = {
            orderLines: this.orderLines,
            appliedOffers: [],
            // tslint:disable-next-line: radix
            grandTotal: this.cart.total,
            subTotal: this.cart.subTotal,
            email: this.customer.email,
            storeId: this.cart.storeId,
            customerId: this.customer.preferred_username,
            allergyNote: this.allergyNote,
            date: new Date().toISOString()
          };
          console.log('Order setting to order service is ', order);
          this.orderService.setOrder(order);
          this.logger.info('Delivery type is ', deliveryType);
          this.initiateOrderSubcription = this.orderService
            .initiateOrder()
            .subscribe(
              resource => {
                this.orderService.setOrder(resource.order);
                this.orderService.setResource(resource.commandResource);
                // this.cart.orderLines = resource.order.orderLines;
                this.orderService.orderResourceBehaviour.next(
                  resource.commandResource.nextTaskName
                );
                this.logger.info('Resultant resource is ', resource);
                this.logger.info('Order is ', resource.order);
              },
              error => {
                // this.orderService.orderResourceBehaviour.thrownError;
                this.logger.error(
                  'An error has occured while initiating the order ',
                  error
                );
                this.util.createToast(
                  'Something went wrong try again',
                  'information-circle-outline'
                );
              }
            );
        } else {
          console.log('Current status is ', this.getStatus());
          this.orderService.order.status = this.getStatus();
          this.orderLinesUpdated = [];
          this.cart.orderLines.forEach(orderLineUpdated => {
            let updated ;
            this.orderService.order.orderLines.forEach(orderLine => {
              if (orderLine.productId === orderLineUpdated.productId) {
                orderLineUpdated.id = orderLine.id;
                this.orderLinesUpdated.push(orderLineUpdated);
                updated = true;
              }
            });
            if (!updated) {
              this.orderLinesUpdated.push(orderLineUpdated);
            }
          });
          this.orderService.order.orderLines = this.orderLinesUpdated;
          this.orderService.order.allergyNote = this.allergyNote;
          this.orderService.order.subTotal = this.cart.subTotal;
          this.orderService.order.grandTotal = this.cart.total;
          if (this.orderService.deliveryInfo !== undefined) {
            this.logger.info('Deliveryinfo exists ');
            this.orderService.order.deliveryInfo = this.orderService.deliveryInfo;
          }
          this.logger.info('Going to Update Order id is', this.orderService.order);
          this.orderService
            .updateOrder(this.orderService.order)
            .subscribe(order => {
              this.logger.info('Order DTO Updated is ', order);
              this.orderService.order = order;
            });
        }
      },
      err => this.logger.error('An Error occured during sign in ', err)
    );
    this.navController.navigateForward('/checkout');
  }

  getStatus(): Status {
    console.log('Resource getStatus ', this.orderService.resource);
    let status: Status;
    if (this.orderService.resource.nextTaskName === 'Collect Delivery Info&Place Order') {
      console.log('in if**');
      status = {
        name: 'unapproved',
        id: 1
      };
    } else {
      console.log('in else **');
      status = {
        name: 'approved',
        id: 3
      };
    }
    console.log('status in getStatus ', status);
    return status;
  }
  segmenChanged(event) {
    if (this.delivery !== undefined) {
      this.deliveryMode = event.detail.value;
      this.currentSegment = event.detail.value;
    }
  }
}
