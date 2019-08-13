import { Storage } from '@ionic/storage';
import { Order } from './../../api/models/order';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { AllergyComponent } from './../allergy/allergy.component';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, Input } from '@angular/core';
import { OrderLine } from 'src/app/api/models';
import { ModalController } from '@ionic/angular';
import { OrderCommandResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() viewType = 'minimal';

  @Input() store = {};

  currentSegment = 'delivery';

  cartSize = 0;

  totalPrice = 0;

  orderLines: OrderLine[] = [];

  selectedAddress;

  note = '';

  customer;

  constructor(
    private cart: CartService,
    private modalController: ModalController,
    private queryResource: QueryResourceService,
    private orderCommandResource: OrderCommandResourceService,
    private storage: Storage,
    private util: Util
  ) {}

  ngOnInit() {
    console.log(this.viewType);
    this.getCartDetails();
    this.getCustomer();
  }

  getCustomer() {
    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.storage.get('user').then(user => {
        this.queryResource
          .findCustomerByReferenceUsingGET(user.preferred_username)
          .subscribe(customer => {
            console.log('Got Customer' , customer);
            loader.dismiss();
            this.customer = customer;
          },
          err => {
            loader.dismiss();
          });
      });
    });

  }

  getCartDetails() {
    this.cart.observableTickets.subscribe(data => {
      console.log(data);
      this.cartSize = data.length;
      this.totalPrice = this.cart.totalPrice;
      this.orderLines = data;
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

  checkout() {
    let grandtotal = 0;
    this.orderLines.forEach(orderLine => {
      grandtotal += orderLine.pricePerUnit * orderLine.quantity;
    });
    const order: Order = {
      customerId: this.customer.name,
      orderLines: this.orderLines,
      grandTotal: grandtotal,
      storeId: this.cart.storeId,
      notes: this.note
    };
    // this.presentModal(order);
  }

  addressSelectedEven(event) {
    console.log('Address Selected', event);
    this.selectedAddress = event;
  }

  segmenChanged(event) {
    this.currentSegment = event.detail.value;
  }
}
