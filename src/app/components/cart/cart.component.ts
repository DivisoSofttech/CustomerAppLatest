import { Storage } from '@ionic/storage';
import { Order } from './../../api/models/order';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { AllergyComponent } from './../allergy/allergy.component';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, Input } from '@angular/core';
import { OrderLine, Store, StoreSettings } from 'src/app/api/models';
import { ModalController, NavController } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { OrderService } from 'src/app/services/order.service';
import { OrderCommandResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() viewType = 'minimal';

  @Input() store: Store;

  shopRegNo: string;

  currentSegment = 'delivery';

  cartSize = 0;

  totalPrice = 0;

  orderLines: OrderLine[] = [];

  selectedAddress;

  note = '';

  customer;

  neededCheckOutAmount = 0;

  storeSetting: StoreSettings;


  constructor(
    private cart: CartService,
    private orderService: OrderService,
    private modalController: ModalController,
    private navController: NavController,
    private storage: Storage,
    private util: Util,
    private orderCommandResource: OrderCommandResourceService
  ) {}

  ngOnInit() {
    this.getCartDetails();
    this.getCustomer();
  }

  getCustomer() {
    this.util.createLoader().then(loader => {
      loader.present();
      this.storage.get('customer').then(user => {
        this.customer = user;
        loader.dismiss();
      })
      .catch(err => {
        loader.dismiss();
      });
    });
  }

  getCartDetails() {
    this.cart.observableTickets.subscribe(data => {
      this.cartSize = data.length;
      this.totalPrice = this.cart.totalPrice;
      this.orderLines = data;
      this.storeSetting = this.cart.currentShopSetting;
      this.store = this.cart.currentShop;
      if ( this.store !== undefined && this.store.minAmount > this.totalPrice) {
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
    let grandtotal = 0;
    this.orderLines.forEach(orderLine => {
      grandtotal += orderLine.pricePerUnit * orderLine.quantity;
    });
    grandtotal = grandtotal + this.storeSetting.deliveryCharge;
    const order: Order = {
      customerId: this.customer.reference,
      orderLines: this.orderLines,
      grandTotal: grandtotal,
      storeId: this.cart.storeId,
      email: this.customer.email
    };

    this.orderService.setCustomer(this.customer);
    this.orderService.setOrder(order);
    this.orderService.setDeliveryType(deliveryType);
    this.orderService.initiateOrder().subscribe((resource) => {
      this.orderService.setResource(resource);
      this.navController.navigateForward('/checkout');
    },
    (err) => {console.log('oops something went wrong'); });
  }

  segmenChanged(event) {
    this.currentSegment = event.detail.value;
  }
}
