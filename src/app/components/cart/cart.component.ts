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
import { OrderLine, Store, StoreSettings } from 'src/app/api/models';
import { ModalController, NavController } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { OrderService } from 'src/app/services/order.service';
import { OrderCommandResourceService } from 'src/app/api/services';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { Subscription, BehaviorSubject } from 'rxjs';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { DecimalPipe } from '@angular/common';

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

  subTotal = 0;

  orderLines: OrderLine[] = [];

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
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
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

  continue(deliveryType) {
    this.logger.info('In Continue');
    this.orderService.setShop(this.store);
    this.orderService.setDeliveryType(deliveryType);
    this.orderService.setDeliveryCharge(this.storeSetting.deliveryCharge);
    this.loginModal(
      () => {
        if (this.orderService.resource.nextTaskName === undefined) {
          this.logger.info('creating new order >>>>>>>>>>>>>');
          let grandtotal = 0;
          grandtotal =
            grandtotal +
            this.cart.total;
          const order: Order = {
            orderLines: this.orderLines,
            appliedOffers: [],
            // tslint:disable-next-line: radix
            grandTotal: parseFloat(
              this.decimalPipe.transform(grandtotal, '1.1-2')
            ),
            email: this.customer.email,
            storeId: this.cart.storeId,
            customerId: this.customer.preferred_username,
            allergyNote: this.allergyNote
          };
          console.log('The grandtotal is exactly after piping', this.decimalPipe.transform(grandtotal, '1.1-2'));
          this.orderService.setOrder(order);
          this.logger.info('Delivery type is ', deliveryType);
          this.initiateOrderSubcription = this.orderService
            .initiateOrder()
            .subscribe(
              resource => {
                this.orderService.setResource(resource);
                this.orderService.orderResourceBehaviour.next(
                  resource.nextTaskName
                );
                this.logger.info('Resultant resource is ', resource);
                this.logger.info('Order is ', this.orderService.order);
              },
              error => {
                this.orderService.orderResourceBehaviour.thrownError();
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
          this.orderService.order.orderLines = this.cart.orderLines;
          this.orderService.order.allergyNote = this.allergyNote;
          if (this.orderService.deliveryInfo !== undefined) {
            this.logger.info('Deliveryinfo exists ');
            this.orderService.order.deliveryInfo = this.orderService.deliveryInfo;
          }
          let grandtotal = 0;
          grandtotal =
            grandtotal + this.cart.total;
          grandtotal = parseFloat(
            this.decimalPipe.transform(grandtotal, '1.1-2')
          ),
          this.orderService.order.grandTotal = grandtotal;
          alert(this.orderService.order.grandTotal);
          this.logger.info('Update Order id is', this.orderService.order);
          this.orderService
            .updateOrder(this.orderService.order)
            .subscribe(orderDTO => {
              this.logger.info('Order DTO Updated is ', orderDTO);
            });
        }
      },
      err => this.logger.error('An Error occured during sign in ', err)
    );
    this.navController.navigateForward('/checkout');
  }

  segmenChanged(event) {
    if (this.delivery !== undefined) {
      this.deliveryMode = event.detail.value;
      this.currentSegment = event.detail.value;
    }
  }
}
