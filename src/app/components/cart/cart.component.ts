import { NGXLogger } from 'ngx-logger';
import { DeliveryItemDetailsComponent } from './../delivery-item-details/delivery-item-details.component';
import { Order } from './../../api/models/order';
import { AllergyComponent } from './../allergy/allergy.component';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OrderLine, Store, StoreSettings } from 'src/app/api/models';
import { ModalController, NavController } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { OrderService } from 'src/app/services/order.service';
import { OrderCommandResourceService } from 'src/app/api/services';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { Subscription, BehaviorSubject } from 'rxjs';

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

  totalPrice = 0;

  orderLines: OrderLine[] = [];

  selectedAddress;

  note = '';

  customer;

  neededCheckOutAmount = 0;

  storeSetting: StoreSettings;
  deliveryOk = false;
  collectionOk = false;
  defaultDelivery = false;

  initiateOrderSubcription: Subscription;


  @Output() viewClick = new EventEmitter();


  @ViewChild(DeliveryItemDetailsComponent , null) delivery: DeliveryItemDetailsComponent;

  constructor(
    private cart: CartService,
    private orderService: OrderService,
    private keycloakService: KeycloakService,
    private modalController: ModalController,
    private navController: NavController,
    private logger: NGXLogger,
    private util: Util
  ) {}

  ngOnInit() {
    this.getCartDetails();
    this.getCustomer();
    if(this.viewType === 'full') {
      this.cart.behaviourDeliveryTypes.subscribe(data => {
        if(data !== undefined) {
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
  }

  routeBasket() {
    this.logger.info('Firing event');
    this.viewClick.emit({});
  }

  async loginModal(continueMethod) {
    if (this.guest === true) {
      const modal = await this.modalController.create({
        component: LoginSignupComponent,
        componentProps: { type: 'modal' }
      });

      modal.present();
      modal.onDidDismiss().then(data => {
        if (data.data) {
          continueMethod();
        }
      });
    } else {
      continueMethod();
    }
  }

  getCustomer() {
    this.util.createLoader().then(loader => {
      loader.present();
      this.keycloakService.getUserChangedSubscription()
      .subscribe(user => {
        this.customer  = user;
        if (user === null || user.preferred_username === 'guest') {
          this.guest = true;
        } else {
          this.guest = false;
        }
    });
  });
  }

  checkDeliveryTypeExists() {
    this.logger.info('Checking delivery Types');
    if (this.cart.currentDeliveryTypes !== undefined) {
      if (this.cart.currentDeliveryTypes.length === 1) {
        if (this.cart.currentDeliveryTypes[0].name === 'delivery') {
          this.deliveryOk = true;
          this.currentSegment = 'delivery';
        } else if (this.cart.currentDeliveryTypes[0].name === 'collection') {
          this.collectionOk = true;
          this.currentSegment = 'collection';
          this.defaultDelivery = false;
        }
      } else {
        this.cart.currentDeliveryTypes.forEach(element => {
          if (element.name === 'delivery') {
            this.deliveryOk = true;
          } else if (element.name === 'collection') {
            this.collectionOk = true;
            this.defaultDelivery = false;
          }
        });
      }
    } else {
      if(this.cart.currentShop !== undefined) {
        this.cart.getStoreSettings();
      }
    }
  }

  getCartDetails() {
    this.cart.observableTickets.subscribe(data => {
      this.cartSize = data.length;
      this.totalPrice = this.cart.totalPrice;
      this.orderLines = data;
      this.storeSetting = this.cart.currentShopSetting;
      this.store = this.cart.currentShop;
      if (this.store !== undefined && this.store.minAmount > this.totalPrice) {
        this.neededCheckOutAmount = this.store.minAmount - this.totalPrice;
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
  }

  continue(deliveryType) {
    console.log('IN continue ****** ', this.customer);
    this.orderService.setShop(this.store);
    this.orderService.setDeliveryType(deliveryType);
    this.orderService.setDeliveryCharge(this.storeSetting.deliveryCharge);
    this.loginModal(() => {
      let grandtotal = 0;
      grandtotal =
        grandtotal + this.storeSetting.deliveryCharge + this.cart.totalPrice;
      const order: Order = {
        orderLines: this.orderLines,
        grandTotal: grandtotal,
        email: this.customer.email,
        storeId: this.cart.storeId,
        customerId: this.customer.preferred_username
      };
      this.orderService.setOrder(order);
      this.logger.info('Order is in continue ', order);

      console.log('IN continue ****** 2');
      console.log('Delivery type is ', deliveryType);
      this.initiateOrderSubcription =  this.orderService.initiateOrder().subscribe(
        resource => {
          this.orderService.setResource(resource);
          this.orderService.orderResourceBehaviour.next(resource.nextTaskName);
          this.orderService.order.orderId = resource.orderId;
          console.log(
            'Next task name is ' +
              resource.nextTaskId +
              ' Next task name ' +
              resource.nextTaskName +
              ' selfid ' +
              resource.selfId +
              ' order id is ' +
              resource.orderId
          );
        },
        error => {
          this.orderService.orderResourceBehaviour.thrownError();
          this.logger.info(
            'An error has occured while initiating the order ',
            error
          );
        }
      );
    });
    this.navController.navigateForward('/checkout');
  }

  segmenChanged(event) {
    this.delivery.currentDeliveryMode = event.detail.value;
    this.currentSegment = event.detail.value;
  }
}
