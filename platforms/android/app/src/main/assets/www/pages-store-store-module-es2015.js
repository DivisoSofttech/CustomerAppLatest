(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-store-store-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/store/store.page.html":
/*!***********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/store/store.page.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <app-store-header\n    *ngIf=\"store != undefined\"\n    [name]=\"store.name\"\n    (searchEnabled)=\"toggleFabButton($event)\"\n  ></app-store-header>\n</ion-header>\n\n<ion-content>\n  <ion-fab *ngIf=\"showCatgeoryFilterFab === true\" vertical=\"top\" horizontal=\"end\" slot=\"fixed\">\n    <ion-fab-button (click)=\"categoryListPopOver($event)\">\n      <ion-icon name=\"pizza\"></ion-icon>\n    </ion-fab-button>\n  </ion-fab>\n\n  <app-loading\n              *ngIf=\"showRestaurantLoading === true\"\n              [type]=\"'restaurant-detail'\"\n  ></app-loading>\n  <app-restaurant-card\n    *ngIf=\"store != undefined\"\n    [store]=\"store\"\n    [viewType]=\"'detailedCard'\"\n  ></app-restaurant-card>\n\n  <ion-segment\n    (ionChange)=\"segmentChanged($event)\"\n    [(ngModel)]=\"currentSegment\"\n  >\n    <ion-segment-button value=\"menu\" checked>\n      <ion-label>Menu</ion-label>\n    </ion-segment-button>\n    <ion-segment-button value=\"reviews\">\n      <ion-label>Reviews</ion-label>\n    </ion-segment-button>\n    <ion-segment-button value=\"info\">\n      <ion-label>Info</ion-label>\n    </ion-segment-button>\n  </ion-segment>\n\n  <ion-slides (ionSlideDidChange)=\"slideChanged($event)\">\n    <ion-slide>\n      <ion-grid no-padding>\n        <ion-row>\n          <ion-list *ngIf=\"store != undefined && showCategoryWiseProducts === false\">\n            <app-product-card\n              *ngFor=\"let stockCurrent of stockCurrents\"\n              [store]=\"store\"\n              [stockCurrent]=\"stockCurrent\"\n            ></app-product-card>\n          </ion-list>\n        </ion-row>\n        <ion-row *ngIf=\"showCategoryWiseProducts === true\">\n          <ion-list *ngFor=\"let category of categories\">\n              <ion-item color=\"light\">\n                  <ion-avatar>\n                      <ion-img\n                      [src]=\"\n                        'data:' +\n                        category.imageContentType +\n                        ';base64,' +\n                        category.image\n                      \"\n                      class=\"imageShow\"\n                    >\n                    </ion-img>\n                  </ion-avatar>\n                <ion-label margin>{{category.name}}</ion-label>\n              </ion-item>\n              <app-category-wise-products-card *ngIf=\"store !== undefined\"\n              [category]=\"category\"\n              [store]=\"store\">\n              </app-category-wise-products-card>\n          </ion-list>\n        </ion-row>\n      </ion-grid>\n    </ion-slide>\n    <ion-slide>\n      <app-review *ngIf=\"store != undefined\" [store]=\"store\"></app-review>\n    </ion-slide>\n    <ion-slide>\n      <ion-grid>\n        <ion-row>\n          <ion-col size=\"12\">\n          <app-map></app-map>\n          </ion-col>\n          <ion-col size=\"12\" *ngIf=\"store !== undefined\">\n            <ion-text *ngIf=\"store.info\">\n              <p>{{ store.info }}</p>\n            </ion-text>\n          </ion-col>\n        </ion-row>\n        <ion-row>\n          <ion-col size=\"12\">\n            <ion-text *ngIf=\"store != undefined\">\n              <p>\n                {{ store.info }}\n              </p>\n            </ion-text>\n          </ion-col>\n        </ion-row>\n      </ion-grid>\n    </ion-slide>\n  </ion-slides>\n\n  <ion-refresher slot=\"fixed\" (ionRefresh)=\"refresh($event)\">\n    <ion-refresher-content\n      pullingIcon=\"arrow-dropdown\"\n      pullingText=\"Pull to refresh\"\n      refreshingSpinner=\"circles\"\n    >\n    </ion-refresher-content>\n  </ion-refresher>\n</ion-content>\n\n<ion-footer>\n  <app-cart *ngIf=\"currentSegment === 'menu'\"></app-cart>\n</ion-footer>\n"

/***/ }),

/***/ "./src/app/pages/store/store.module.ts":
/*!*********************************************!*\
  !*** ./src/app/pages/store/store.module.ts ***!
  \*********************************************/
/*! exports provided: StorePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StorePageModule", function() { return StorePageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _components_cart_cart_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../components/cart/cart.component */ "./src/app/components/cart/cart.component.ts");
/* harmony import */ var _components_review_review_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../components/review/review.component */ "./src/app/components/review/review.component.ts");
/* harmony import */ var _components_store_header_store_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../components/store-header/store-header.component */ "./src/app/components/store-header/store-header.component.ts");
/* harmony import */ var _components_product_card_product_card_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../components/product-card/product-card.component */ "./src/app/components/product-card/product-card.component.ts");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../components/components.module */ "./src/app/components/components.module.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _store_page__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./store.page */ "./src/app/pages/store/store.page.ts");
/* harmony import */ var src_app_components_restaurant_card_restaurant_card_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/app/components/restaurant-card/restaurant-card.component */ "./src/app/components/restaurant-card/restaurant-card.component.ts");
/* harmony import */ var src_app_components_hotel_menu_popover_hotel_menu_popover_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/app/components/hotel-menu-popover/hotel-menu-popover.component */ "./src/app/components/hotel-menu-popover/hotel-menu-popover.component.ts");
/* harmony import */ var src_app_components_loading_loading_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/app/components/loading/loading.component */ "./src/app/components/loading/loading.component.ts");
/* harmony import */ var src_app_components_category_wise_products_card_category_wise_products_card_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/app/components/category-wise-products-card/category-wise-products-card.component */ "./src/app/components/category-wise-products-card/category-wise-products-card.component.ts");
















const routes = [
    {
        path: '',
        component: _store_page__WEBPACK_IMPORTED_MODULE_11__["StorePage"]
    }
];
let StorePageModule = class StorePageModule {
};
StorePageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_6__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_10__["IonicModule"],
            _components_components_module__WEBPACK_IMPORTED_MODULE_5__["ComponentsModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["RouterModule"].forChild(routes)
        ],
        declarations: [_store_page__WEBPACK_IMPORTED_MODULE_11__["StorePage"]],
        entryComponents: [_components_store_header_store_header_component__WEBPACK_IMPORTED_MODULE_3__["StoreHeaderComponent"], src_app_components_restaurant_card_restaurant_card_component__WEBPACK_IMPORTED_MODULE_12__["RestaurantCardComponent"],
            _components_product_card_product_card_component__WEBPACK_IMPORTED_MODULE_4__["ProductCardComponent"], _components_review_review_component__WEBPACK_IMPORTED_MODULE_2__["ReviewComponent"],
            _components_cart_cart_component__WEBPACK_IMPORTED_MODULE_1__["CartComponent"], src_app_components_hotel_menu_popover_hotel_menu_popover_component__WEBPACK_IMPORTED_MODULE_13__["HotelMenuPopoverComponent"], src_app_components_loading_loading_component__WEBPACK_IMPORTED_MODULE_14__["LoadingComponent"],
            src_app_components_category_wise_products_card_category_wise_products_card_component__WEBPACK_IMPORTED_MODULE_15__["CategoryWiseProductsCardComponent"]
        ]
    })
], StorePageModule);



/***/ }),

/***/ "./src/app/pages/store/store.page.scss":
/*!*********************************************!*\
  !*** ./src/app/pages/store/store.page.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ion-list {\n  width: 100%;\n}\n\nion-footer {\n  background: blue;\n  color: white;\n}\n\napp-loading {\n  width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ppc2hudWovRGVza3RvcC9Xb3JrL0N1c3RvbWVyQXBwTGF0ZXN0L3NyYy9hcHAvcGFnZXMvc3RvcmUvc3RvcmUucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9zdG9yZS9zdG9yZS5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFBO0FDQ0Y7O0FERUE7RUFDRSxnQkFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLFdBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3N0b3JlL3N0b3JlLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImlvbi1saXN0IHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbmlvbi1mb290ZXIge1xuICBiYWNrZ3JvdW5kOiBibHVlO1xuICBjb2xvcjogd2hpdGU7XG59XG5cbmFwcC1sb2FkaW5nIHtcbiAgd2lkdGg6IDEwMCU7XG59IiwiaW9uLWxpc3Qge1xuICB3aWR0aDogMTAwJTtcbn1cblxuaW9uLWZvb3RlciB7XG4gIGJhY2tncm91bmQ6IGJsdWU7XG4gIGNvbG9yOiB3aGl0ZTtcbn1cblxuYXBwLWxvYWRpbmcge1xuICB3aWR0aDogMTAwJTtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/pages/store/store.page.ts":
/*!*******************************************!*\
  !*** ./src/app/pages/store/store.page.ts ***!
  \*******************************************/
/*! exports provided: StorePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StorePage", function() { return StorePage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_api_services_query_resource_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/api/services/query-resource.service */ "./src/app/api/services/query-resource.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_components_hotel_menu_popover_hotel_menu_popover_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/components/hotel-menu-popover/hotel-menu-popover.component */ "./src/app/components/hotel-menu-popover/hotel-menu-popover.component.ts");
/* harmony import */ var src_app_services_util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/util */ "./src/app/services/util.ts");
/* harmony import */ var ngx_logger__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-logger */ "./node_modules/ngx-logger/fesm2015/ngx-logger.js");









let StorePage = class StorePage {
    constructor(queryResource, route, popover, logger, util) {
        this.queryResource = queryResource;
        this.route = route;
        this.popover = popover;
        this.logger = logger;
        this.util = util;
        this.stockCurrents = [];
        this.tempStockCurrents = [];
        this.currentSegment = 'menu';
        this.selectedCategory = 'All';
        this.showRestaurantLoading = true;
        this.showCategoryWiseProducts = true;
        this.categories = [];
        this.entry = [];
        this.showCatgeoryFilterFab = true;
    }
    ngOnInit() {
        this.getStoreId();
        this.getStore();
        this.getCategories(0);
        this.getCategoriesEntry(0);
    }
    getStoreId() {
        this.storeId = this.route.snapshot.paramMap.get('id');
    }
    getStore() {
        this.queryResource
            .findStoreByRegisterNumberUsingGET(this.storeId)
            .subscribe(result => {
            this.logger.info('Got Store ', result.name, result);
            this.store = result;
            this.showRestaurantLoading = false;
        }, err => {
            this.showRestaurantLoading = false;
            this.logger.fatal('Error Fetching Stores', err);
        });
    }
    getCategoriesEntry(i) {
        this.queryResource
            .findCategoryAndCountBystoreIdUsingGET({
            storeId: this.storeId
        })
            .subscribe(result => {
            this.logger.info('Got Categories Entry', result);
            this.entry = result;
        }, err => {
            this.logger.fatal('Error Fetching Categories Entry', err);
        });
    }
    getCategories(i) {
        this.queryResource
            .findAllCategoriesUsingGET({
            iDPcode: this.storeId
        })
            .subscribe(result => {
            this.logger.info('Got Categories', result);
            result.content.forEach(c => {
                this.categories.push(c);
            });
            ++i;
            if (i < result.totalPages) {
                this.getCategories(i);
            }
        });
    }
    segmentChanged(event) {
        this.currentSegment = event.detail.value;
        if (this.currentSegment === 'menu') {
            this.ionSlides.slideTo(0);
        }
        else if (this.currentSegment === 'reviews') {
            this.ionSlides.slideTo(1);
        }
        else {
            this.ionSlides.slideTo(2);
        }
    }
    categoryListPopOver(ev) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            this.tempStockCurrents = this.stockCurrents;
            const popover = yield this.popover.create({
                component: src_app_components_hotel_menu_popover_hotel_menu_popover_component__WEBPACK_IMPORTED_MODULE_5__["HotelMenuPopoverComponent"],
                componentProps: {
                    categories: this.entry,
                    storeId: this.storeId,
                    selectedCategory: this.selectedCategory
                },
                event: ev,
                translucent: true
            });
            popover.onDidDismiss().then((data) => {
                if (data.data !== undefined) {
                    this.selectedCategory = data.data.selectedCategory;
                    if (this.selectedCategory === 'All') {
                        this.stockCurrents = this.tempStockCurrents;
                        this.showCategoryWiseProducts = true;
                    }
                    else {
                        this.stockCurrents = data.data.result.filter(s => s !== null);
                        this.logger.info('Got StockCurrent of ', this.selectedCategory, this.stockCurrents);
                        this.showCategoryWiseProducts = false;
                    }
                }
            });
            return yield popover.present();
        });
    }
    slideChanged(event) {
        let index;
        this.ionSlides.getActiveIndex().then(num => {
            index = num;
            if (index === 0) {
                this.currentSegment = 'menu';
            }
            else if (index === 1) {
                this.currentSegment = 'reviews';
            }
            else {
                this.currentSegment = 'info';
            }
        });
    }
    refresh(event) {
        this.getCategories(0);
    }
    toggleIonRefresher() {
        this.IonRefresher.complete();
    }
    toggleFabButton() {
        this.logger.info('Hiding Fab Button');
        this.showCatgeoryFilterFab = !this.showCatgeoryFilterFab;
    }
};
StorePage.ctorParameters = () => [
    { type: src_app_api_services_query_resource_service__WEBPACK_IMPORTED_MODULE_3__["QueryResourceService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"] },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["PopoverController"] },
    { type: ngx_logger__WEBPACK_IMPORTED_MODULE_7__["NGXLogger"] },
    { type: src_app_services_util__WEBPACK_IMPORTED_MODULE_6__["Util"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonSlides"], null),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonSlides"])
], StorePage.prototype, "ionSlides", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonRefresher"], null),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonRefresher"])
], StorePage.prototype, "IonRefresher", void 0);
StorePage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-store',
        template: __webpack_require__(/*! raw-loader!./store.page.html */ "./node_modules/raw-loader/index.js!./src/app/pages/store/store.page.html"),
        styles: [__webpack_require__(/*! ./store.page.scss */ "./src/app/pages/store/store.page.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_api_services_query_resource_service__WEBPACK_IMPORTED_MODULE_3__["QueryResourceService"],
        _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"],
        _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["PopoverController"],
        ngx_logger__WEBPACK_IMPORTED_MODULE_7__["NGXLogger"],
        src_app_services_util__WEBPACK_IMPORTED_MODULE_6__["Util"]])
], StorePage);



/***/ })

}]);
//# sourceMappingURL=pages-store-store-module-es2015.js.map