import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OrderLine, Product, Store, CommandResource, AuxilaryOrderLine } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';
import { ModalController, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { Util } from 'src/app/services/util';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import { MatStepper } from '@angular/material';
import { MAT_STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
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

  @ViewChild('stepper' , null) stepper: MatStepper;

  ngAfterViewInit() {

    if(this.order.status.name === 'created') {
      this.stepper.selected.state = 'done';
    } else if(this.order.status.name === 'approved' || this.order.status.name === 'payment-processed') {
      this.stepper.selected.state = 'done';
      this.stepper.next();
      this.stepper.selected.state = 'done';
    } else if(this.order.status.name === 'delivered') {
      this.stepper.selected.state = 'done';
      this.stepper.next();
      this.stepper.selected.state = 'done';
      this.stepper.next();
      this.stepper.selected.completed = true;
    }  

  }


  ngOnInit() {
    this.logger.info(this.order);
    this.getOrderLines(0);
  }


  async presentMakePayment() {
    await this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: MakePaymentComponent
    });
    return await modal.present();
  }

  completePayment() {
    this.util.createLoader(100000).then(loader => {
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

  ngOnDestroy() {
    console.log('Ng Destroy calls in orderDetail component');
    this.taskDetailsSubscription !== undefined?this.taskDetailsSubscription.unsubscribe():null;
    this.orderLinesByOrderIdSubscription !== undefined?this.orderLinesByOrderIdSubscription.unsubscribe():null
    this.productByProductIdSubscrption !== undefined?this.productByProductIdSubscrption.unsubscribe():null;
    this.auxilayByProductIdSubscription !==undefined?this.auxilayByProductIdSubscription.unsubscribe():null;
  }

  getOrderDetails() {
    this.queryResource.getOrderAggregatorUsingGET(this.order.orderId)
    .subscribe(data => {
      this.logger.error(data);
    })
  }

  getOrderLines(i) {
    this.orderLinesByOrderIdSubscription = this.queryResource.findAllOrderLinesByOrderIdUsingGET({
      orderId: this.order.id
    })
    .subscribe(orderLines => {
      orderLines.content.forEach(o => {
        this.orderLines.push(o);
        this.auxilariesProducts[o.productId] = [];
        this.auxilaryOrderLines[o.id] = [];
        this.getProducts(o.productId);
        this.getAuxilaryOrderLines(o,0);
      });
      i++;
      if(i < orderLines.totalPages) {
        this.getOrderLines(i);
      } else {
        this.logger.info('Completed Fetching OrderLines')
      }
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

        //Hack to Make Product Usable in Places Where AuxilaryLineItem 
      // is used Just add auxilaryItem key to the object

      auxProduct['auxilaryItem']  = auxProduct;
      this.auxilariesProducts[pid+''][id+''] = auxProduct;

    })
  }

  reorder() {
    if (this.cartService.currentShopId === 0) {
      this.addToCart();
    } else if (this.cartService.currentShopId === this.store.id) {
      this.addToCart();
    } else {
      this.cartService.presentRestaurantCheckout({
        actionSuccess:this.addToCart()
      });
    }
  }

  addToCart() {
    this.cartService.addShop(this.store);
    this.orderLines.forEach(o => {
      if (this.auxilaryOrderLines[o.id] === undefined) {
       delete o.requiedAuxilaries;
      } else {
        o.requiedAuxilaries = this.auxilaryOrderLines[o.id];
        this.cartService.auxilaryItems[o.productId] = this.auxilariesProducts[o.productId];
      }
      this.cartService.addOrder(o);
    });
    this.modalController.dismiss(true);

  }

  dismiss() {
    this.modalController.dismiss();
  }
}
