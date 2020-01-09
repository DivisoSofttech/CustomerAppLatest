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
import { Subscription } from 'rxjs';
import { PreorderComponent } from '../preorder/preorder.component';
import { ClosedPipe } from 'src/app/pipes/closed.pipe';
import { LogService } from 'src/app/services/log.service';
import { NoCommaPipe } from 'src/app/pipes/no-comma.pipe';

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
  isOrderAvailable: any = true;
  isClosed: boolean = false;
  enableContinue: boolean = true;

  constructor(
    private cart: CartService,
    private orderService: OrderService,
    private keycloakService: KeycloakService,
    private modalController: ModalController,
    private navController: NavController,
    private logger: LogService,
    private util: Util,
    private popoverController: PopoverController,
    private closedPipe: ClosedPipe,
    private noCommaPipe: NoCommaPipe
  ) { }

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
    if (this.initiateOrderSubcription !== undefined) {
      this.initiateOrderSubcription.unsubscribe();
    }
    this.keycloakSubscription !== undefined
      ? this.keycloakSubscription.unsubscribe()
      : null;
  }

  routeBasket() {
    this.logger.info(this, 'Firing event');
    this.loginModal(
      () => {
        this.logger.info(this, 'Emitting View Click');
        this.viewClick.emit();
      },
      () => { }
    );
  }

  async loginModal(success, error) {
    this.logger.info(this, 'CartComponent Login Modal');
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
                () => { },
                () => {
                  this.keycloakSubscription.unsubscribe();
                  this.navigateBack();
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
      this.allergyNote = data.data;
    });
  }

  async preorderPopover(callback,isCollection) {
    const popover = await this.popoverController.create({
      component: PreorderComponent,
      componentProps: { store: this.store , isCollection:isCollection },
      translucent: false,
      backdropDismiss: false
    });

    popover.onDidDismiss()
      .then((data) => {
        callback(data);
      });
    await popover.present();
  }

  checkPreorderStatus() {

    //Restaurant Should Be Closed
    // Preorder Should be Avialable
    // And Current Time should be between preorder[fromTime and toTime]
    const currentTime = new Date();
    this.isOrderAvailable = !this.closedPipe.transform(currentTime, this.store.openingTime, this.store.closingTime)
      && this.store.preOrderSettings.isPreOrderAvailable
      && this.closedPipe.transform(currentTime, this.store.preOrderSettings.fromTime, this.store.preOrderSettings.toTime);
  }

  checkClosedStatus() {
    const currentTime = new Date();
    this.isClosed = !this.closedPipe.transform(currentTime, this.store.openingTime, this.store.closingTime)
  }

  checkRestaurantStatus(deliveryType) {

    this.logger.info(this, 'Checking if Store is Closed', this.store);
    this.checkPreorderStatus();
    this.checkClosedStatus();
    if (this.isClosed && this.isOrderAvailable || deliveryType==='collection') {
      this.enableContinue = false;
      const tempDeliverytype = deliveryType==='collection'?true:false; 
      this.preorderPopover((data) => {
        if (data.data === true){
          this.continue(deliveryType)
        } else {
          this.enableContinue = true;
        }
      },tempDeliverytype);
    } else if (this.isClosed && !this.isOrderAvailable) {
      this.logger.info(this, 'Restaurant is Closed');
    } else {
      this.continue(deliveryType);
    }
  }

  navigateForward() {
    this.enableContinue =true;
    this.cart.saveCartDetailsToSharedMemory();
    this.navController.navigateForward('/checkout');
  }

  navigateBack() {
    this.navController.back();
  }

  createNewOrder(deliveryType) {

    this.logger.info(this, 'Creating new order', this.cart.total,this.cart.subTotal);
    const order: Order = {
      orderLines: this.orderLines,
      appliedOffers: [],
      preOrderDate: this.cart.preOrderDate ? this.cart.preOrderDate : null,
      // tslint:disable-next-line: radix
      grandTotal: this.noCommaPipe.transform(this.cart.total),
      subTotal: this.noCommaPipe.transform(this.cart.subTotal),
      email: this.customer.email,
      storeId: this.cart.storeId,
      customerId: this.customer.preferred_username,
      allergyNote: this.allergyNote,
      date: new Date().toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.orderService.setOrder(order);
    this.logger.info(this, 'Delivery type is ', deliveryType);
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
          this.logger.info(this, 'Resultant resource is ', resource);
          this.logger.info(this, 'Order is ', resource.order);
          this.navigateForward();
        },
        error => {
          this.enableContinue = true;
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
  }

  updateOrder() {
    this.orderService.order.status = this.getStatus();
    this.orderService.order.preOrderDate = this.cart.preOrderDate ? this.cart.preOrderDate : null,
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
    this.orderService.order.subTotal = this.noCommaPipe.transform(this.cart.subTotal);
    this.orderService.order.grandTotal = this.noCommaPipe.transform(this.cart.total);
    
    if (this.orderService.deliveryInfo !== undefined) {
      this.logger.info(this,'Deliveryinfo exists ');
      this.orderService.order.deliveryInfo = this.orderService.deliveryInfo;
    }
    this.logger.info(this,'Going to Update Order id is', this.orderService.order);
    this.orderService
      .updateOrder(this.orderService.order)
      .subscribe(order => {
        this.logger.info(this,'Order DTO Updated is ', order);
        this.orderService.order = order;
        this.navigateForward();
      },
      err=> {
        this.enableContinue =true;
      });
  }

  continue(deliveryType) {
    this.logger.info(this, 'In Continue');
    this.orderService.setShop(this.store);
    this.orderService.setDeliveryType(deliveryType);
    this.orderService.setDeliveryCharge(this.storeSetting.deliveryCharge);
    this.loginModal(
      () => {
        if (this.orderService.resource.nextTaskName === undefined) {
          this.createNewOrder(deliveryType);
        } else {
          this.updateOrder();
        }
      },
      err => this.logger.error('An Error occured during sign in ', err)
    );
  
  }

  getStatus(): Status {
    this.logger.info(this,'Resource getStatus ', this.orderService.resource);
    let status: Status;
    if (this.orderService.resource.nextTaskName === 'Collect Delivery Info&Place Order') {
      status = {
        name: 'unapproved',
        id: 1
      };
    } else {
      status = {
        name: 'approved',
        id: 3
      };
    }
    return status;
  }

  segmenChanged(event) {
    if (this.delivery !== undefined) {
      this.deliveryMode = event.detail.value;
      this.currentSegment = event.detail.value;
      this.cart.selectedDeliveryType.next(this.currentSegment);
    }
  }
}
