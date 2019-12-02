import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OrderLine, Product, Store, CommandResource, AuxilaryOrderLine, Offer } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';
import { ModalController, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  @Input() order: Order;

  orderLines: OrderLine[] = [];

  products: Product[] = [];

  comboLineItems = {};

  auxilariesProducts = {};

  total = {};
  offer: Offer[] = [];

  auxilaryOrderLines: AuxilaryOrderLine = {};

  taskDetailsSubscription: Subscription;
  orderLinesByOrderIdSubscription: Subscription;
  productByProductIdSubscrption: Subscription;
  auxilayByProductIdSubscription: Subscription;

  @Input() store: Store;
  addressString: string;

  constructor(
    private logger: NGXLogger,
    private queryResource: QueryResourceService,
    private cartService: CartService,
    private modalController: ModalController,
    private navController: NavController,
    private orderService: OrderService,
    private util: Util
  ) { }
  ngOnInit() {
    this.logger.info(this.order);
    // this.getOrderDetails();
    this.getOrderLines(0);
    this.getAppliedOffers(this.order.id);
    for(let key in this.order.deliveryInfo.deliveryAddress) {
      if(this.order.deliveryInfo.deliveryAddress[key] !== null) {
        this.addressString += this.order.deliveryInfo.deliveryAddress[key] + ',';
      }
    }
    if(this.addressString.endsWith(',')) {
      this.addressString = this.addressString.slice(0,this.addressString.length-1);
    }
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
        this.total[o.id] = 0;
        this.orderLines.push(o);
        this.auxilariesProducts[o.productId] = [];
        this.auxilaryOrderLines[o.id] = [];
        this.getProducts(o.productId);
        this.getAuxilaryOrderLines(o, 0);
      });
      i++;
      if(i < orderLines.totalPages) {
        this.getOrderLines(i);
      } else {
        this.logger.info('Completed Fetching OrderLines');
      }
    });
  }

  getAppliedOffers(id) {
    this.queryResource.findOfferLinesByOrderIdUsingGET(id)
      .subscribe(offerLines => {
      this.logger.info('OfferLines for the order is ', offerLines);
      this.offer = offerLines;
    });
  }

  getAuxilaryOrderLines(o , i) {
    this.queryResource.findAuxilaryOrderLineByOrderLineIdUsingGET({
      orderLineId: o.id
    })
    .subscribe(auxLines => {
      auxLines.content.forEach(auxLine => {
        this.total[o.id] += auxLine.total;
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

  dismiss(value) {
    this.modalController.dismiss(value);
    this.orderService.offer = undefined;
    this.orderService.deliveryInfo = {};

  }

}
