import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OrderLine, Product, Store, CommandResource, AuxilaryOrderLine } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';
import { ModalController, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { Util } from 'src/app/services/util';
import { MakePaymentComponent } from '../make-payment/make-payment.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
 

  @Input() order: Order;

  products: Product[] = [];

  auxilariesProducts = {};

  orderLines: OrderLine[] = [];

  auxilaryOrderLines: AuxilaryOrderLine = {};

  taskDetailsSubscription: Subscription;
  orderLinesByOrderIdSubscription: Subscription;
  productByProductIdSubscrption: Subscription;
  auxilayByProductIdSubscription: Subscription;

  @Input() store: Store;

  constructor(
    private logger: NGXLogger,
    private queryResource: QueryResourceService,
    private cartService: CartService,
    private modalController: ModalController,
    private orderService: OrderService,
    private navController: NavController,
    private util: Util
  ) { }


  async presentMakePayment() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: MakePaymentComponent
    });
    return await modal.present();
  }

  completePayment() {
    this.util.createLoader().then(loader => {
    loader.present();
    this.orderService.order = this.order;
    this.taskDetailsSubscription = this.queryResource.getTaskDetailsUsingGET(
      {taskName: 'Process Payment', orderId: this.order.orderId, storeId: this.order.customerId})
      .subscribe(openTask => {
        console.log('Open task is ', openTask);
        const resource: CommandResource = {
          nextTaskId: openTask.taskId,
          nextTaskName: openTask.taskName,
          orderId: this.order.orderId
        };
        this.orderService.resource = resource;
        loader.dismiss();
        this.dismiss();
        this.presentMakePayment();
      });
    });
  }

  ngOnInit() {
    this.logger.info(this.order);
    this.getOrderLines(0);
  }

  ngOnDestroy() {
    console.log('Ng Destroy calls in orderDetail component');
    this.taskDetailsSubscription !== undefined?this.taskDetailsSubscription.unsubscribe():null;
    this.orderLinesByOrderIdSubscription !== undefined?this.orderLinesByOrderIdSubscription.unsubscribe():null
    this.productByProductIdSubscrption !== undefined?this.productByProductIdSubscrption.unsubscribe():null;
    this.auxilayByProductIdSubscription !==undefined?this.auxilayByProductIdSubscription.unsubscribe():null;
  }

  getOrderLines(i) {
    this.orderLinesByOrderIdSubscription = this.queryResource.findOrderLinesByOrderIdUsingGET(this.order.id)
    .subscribe(orderLines => {
      this.orderLines = orderLines;
      this.orderLines.forEach(o => {
        this.auxilariesProducts[o.productId] = [];
        this.auxilaryOrderLines[o.id] = [];
        this.getProducts(o.productId);
        this.getAuxilaryOrderLines(o,0);
      });
      i++;
      // if(i < orderLines.totalPages) {

      // }
    });
  }

  getAuxilaryOrderLines(o , i) {
    this.queryResource.findAuxilaryOrderLineByOrderLineIdUsingGET({
      orderLineId: o.id
    })
    .subscribe(auxLines => {
      auxLines.content.forEach(auxLine => {
        this.auxilaryOrderLines[o.id].push(auxLine);
        this.getAuxilaryProduct(o.productId,auxLine.productId)
      });
      i++;
      if(i < auxLines.totalPages) {
        this.getAuxilaryOrderLines(o,i);
      } else {
        this.logger.info('Fetched All Auxilaries');
      }
    })
  }

  getProducts(id) {
   this.productByProductIdSubscrption =  this.queryResource.findProductByIdUsingGET(id)
    .subscribe(data => {
      this.products[data.id] = data;
    });
  }

  getAuxilaryProduct(pid , id) {
    this.queryResource.findProductByIdUsingGET(id)
    .subscribe(auxProduct => {
      this.logger.info(auxProduct.name , 'for' , pid);
      this.auxilariesProducts[pid][id] = auxProduct;
    })
  }

  reorder() {
    if (this.cartService.currentShopId === 0) {
      this.addToCart();
    } else if (this.cartService.currentShopId === this.store.id) {
      this.addToCart();
    } else {
      this.cartService.presentAlert();
    }
  }

  addToCart() {
    this.cartService.addShop(this.store);
    this.orderLines.forEach(o => {
      if (this.auxilaryOrderLines[o.id] === null) {
       delete o.requiedAuxilaries;
      } else {
        o.requiedAuxilaries = this.auxilaryOrderLines[o.id];
      }
      this.logger.info(o);
      this.modalController.dismiss();
      this.navController.navigateForward('/basket');
      this.cartService.addOrder(o);
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
