import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { Order, OrderLine, Product, Store, AuxilaryOrderLine, Offer, CancelledOrderLine } from 'src/app/api/models';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import { MatStepper, MatHorizontalStepper } from '@angular/material';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { LogService } from 'src/app/services/log.service';
import { ModalController, IonRefresher } from '@ionic/angular';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class OrderDetailComponent implements OnInit {

  @Output() backEvent: EventEmitter<void> = new EventEmitter();

  @Output() reorderEvent: EventEmitter<void> = new EventEmitter();

  @Output() continueEvent: EventEmitter<void> = new EventEmitter();

  @Input() order: Order;

  @Input() viewType = 'full';

  @Input() ShowContinueShopping: Boolean = false;

  @Input() modalType: Boolean = false;

  @Input() store: Store;

  orderLines: OrderLine[] = [];

  cancelledOrderLines: CancelledOrderLine[] = [];

  offer: Offer[] = [];

  products: Product[] = [];

  // Main Product id as key && AuxProduct as Value
  auxilariesProducts: Map<Number, Product[]> = new Map<Number, Product[]>();

  // OrderLine id as Key
  auxilaryOrderLines: Map<Number, AuxilaryOrderLine[]> = new Map<Number, AuxilaryOrderLine[]>();

  // OrderLine id as Key and auxLine Total + OrdrLine total as Value
  total: Map<Number, Number> = new Map<Number, Number>();

  cancellationTotal = 0;

  addressString: String;

  orderPlaced: Boolean;
  orderApproved: Boolean;
  orderDelivered: Boolean;
  orderCancelled: Boolean;
  orderRefundCompleted: Boolean;

  showCancellation: Boolean = false;


  taskDetailsSubscription: Subscription;
  orderLinesByOrderIdSubscription: Subscription;
  productByProductIdSubscrption: Subscription;
  auxilayByProductIdSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private logger: LogService,
    private util: Util,
    private queryResource: QueryResourceService,
    private modalController: ModalController
  ) { }

  @ViewChild(MatHorizontalStepper, null) stepper: MatStepper;
  @ViewChild(IonRefresher , null) refresher: IonRefresher;

  initStepper() {
    if (this.orderPlaced) {
      this.stepper.selected.state = 'done';
    } else if (this.orderApproved) {
      this.stepper.selected.state = 'done';
      this.stepper.next();
      this.stepper.selected.state = 'done';
    } else if (this.orderDelivered) {
      this.stepper.selected.state = 'done';
      this.stepper.next();
      this.stepper.selected.state = 'done';
      this.stepper.next();
      this.stepper.selected.completed = true;
    }
  }

  ngOnInit() {
    if (this.viewType === 'full') {
      this.logger.info(this, this.order);
      this.fetchOrderLinesByOrderId(0);
      this.fetchCancelledOrderlines(0);
      this.fetchAppliedOffers(this.order.id);
      this.checkOrderType();
    }
  }

  ngAfterViewInit() {
    this.initStepper();
  }

  checkOrderType() {
    if (!this.order.cancellationRef) {
      switch (this.order.status.name) {

        case 'payment-processed-unapproved':
          this.orderPlaced = true;
          this.orderApproved = false;
          this.orderDelivered = false;
          break;
        case 'payment-processed-approved':
          this.orderPlaced = false;
          this.orderApproved = true;
          this.orderDelivered = false;
          break;
        case 'delivered':
          this.orderPlaced = false;
          this.orderApproved = false;
          this.orderDelivered = true;
          break;
        // case 'cancellation-requested':
        //   this.orderCancelled = true;
        //   this.orderRefundCompleted = false;
        //   break;
        // case 'refund-completed':
        //   this.orderCancelled = true;
        //   this.orderRefundCompleted = true;
        //   break;
        default: break;
      }
    } else {
      this.orderCancelled = true;
      this.orderRefundCompleted = false;
    }
  }

  fetchOrderLinesByOrderId(i) {
    this.orderLinesByOrderIdSubscription = this.queryResource.findAllOrderLinesByOrderIdUsingGET({
      orderId: this.order.id
    })
      .subscribe(orderLines => {
        orderLines.content.forEach(o => {
          this.total[o.id] = 0;
          this.auxilariesProducts[o.productId] = [];
          this.auxilaryOrderLines[o.id] = [];
          this.orderLines.push(o);
          this.fetchProducts(o.productId);
          this.fetchAuxilaryOrderLines(o, 0);
        });
        i++;
        if (i < orderLines.totalPages) {
          this.fetchOrderLinesByOrderId(i);
        } else {
          this.logger.info(this, 'Completed Fetching OrderLines');
        }
      },
      err => {
        this.logger.error(this, 'Érror Fetching OrderLines');
        this.util.createToast('Érror getting order details');
      });
  }


  fetchCancelledOrderlines(i) {
    if (this.order.cancellationRef !== null) {
      this.queryResource.findCancelledOrderLinesByCancellationRequestIdUsingGET({
        id: this.order.cancellationRef
      })
      .subscribe(cancelledOrderLines => {
        cancelledOrderLines.content.forEach(co => {
          this.cancellationTotal += co.ammount;
          this.auxilariesProducts[co.productId] = [];
          this.auxilaryOrderLines[co.id] = [];
          this.cancelledOrderLines.push(co);
          this.fetchProducts(co.productId);
          this.fetchAuxilaryOrderLines(co, 0);
        });
        i++;
        if (i < cancelledOrderLines.totalPages) {
          this.fetchCancelledOrderlines(i);
        } else {
          this.logger.info(this, 'Completed Fetching Cancelled OrderLines');
        }
      });
    }
  }


  fetchAppliedOffers(id) {
    this.queryResource.findOfferLinesByOrderIdUsingGET(id)
      .subscribe(offerLines => {
        this.logger.info(this, 'OfferLines for the order is ', offerLines);
        this.offer = offerLines;
      },
      err => {
        this.logger.error(this, 'Érror Fetching Offer Details');
      });
  }

  fetchAuxilaryOrderLines(o, i) {
    this.queryResource.findAuxilaryOrderLineByOrderLineIdUsingGET({
      orderLineId: o.id
    })
      .subscribe(auxLines => {
        auxLines.content.forEach(auxLine => {
          this.total[o.id] += auxLine.total;
          this.auxilaryOrderLines[o.id].push(auxLine);
          this.fetchProducts(o.productId, auxLine.productId);
        });
        i++;
        if (i < auxLines.totalPages) {
          this.fetchAuxilaryOrderLines(o, i);
        } else {
          this.logger.info(this, 'Fetched All Auxilaries');
        }
      },
      err => {
        this.logger.error(this, 'Érror Fetching Auxilary OrderLines');
      });
  }

  fetchProducts(id, pid?) {
    this.productByProductIdSubscrption = this.queryResource.findProductByIdUsingGET(id)
      .subscribe(data => {
        this.products[data.id] = data;
        if (pid) {
          this.auxilariesProducts[pid + ''][id + ''] = data;
        }
      },
      err => {
        this.logger.error(this, 'Érror Fetching Product', id);
      });
  }



  reorder() {
    if (this.cartService.currentShopId === 0) {
      this.addToCart();
    } else if (this.cartService.currentShopId === this.store.id) {
      this.addToCart();
    } else {
      this.cartService.presentRestaurantCheckout(() => {
        this.cartService.emptyCart();
        this.addToCart();
      });
    }
  }

  addToCart() {
    this.cartService.addShop(this.store);
    const tempOrderLines = [];
    this.orderLines.forEach(o => tempOrderLines.push({ ...o }));

    tempOrderLines.forEach(o => {
      // Delete Id Of Each OrderLine.
      delete o.id;
      if (this.auxilaryOrderLines[o.id] === undefined) {
        delete o.requiedAuxilaries;
      } else {
        o.requiedAuxilaries = this.auxilaryOrderLines[o.id];
        this.cartService.auxilaryItems[o.productId] = this.auxilariesProducts[o.productId];
      }
      this.cartService.addOrder(o, this.store);
    });
    this.reorderEvent.emit();

  }

  refresh(event) {
    this.orderLines = [];
    this.cancelledOrderLines = [];
    this.offer = [];
    this.products = [];
    this.auxilariesProducts = new Map<Number, Product[]>();
    this.auxilaryOrderLines = new Map<Number, AuxilaryOrderLine[]>();
    this.total = new Map<Number, Number>();
    this.cancellationTotal = 0;
    this.addressString  = undefined;
    this.orderPlaced  = false;
    this.orderApproved  = false;
    this.orderDelivered = false;
    this.orderCancelled = false;
    this.orderRefundCompleted = false;
    this.showCancellation = false;
    this.ngOnInit();
    this.refresher.disabled = true;
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    setTimeout(() => {
      this.refresher.disabled = false;
    }, 4000);
  }

  continue() {
    this.continueEvent.emit();
  }

  toggleCancellation() {
    this.showCancellation = !this.showCancellation;
  }

  dismiss() {
    this.backEvent.emit();
  }

  modalDismiss() {
    this.modalController.dismiss();
  }
}
