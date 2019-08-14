(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-store-store-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/store/store.page.html":
/*!***********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/store/store.page.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <app-store-header\n    *ngIf=\"store != undefined\"\n    [name]=\"store.name\"\n  ></app-store-header>\n</ion-header>\n\n<ion-content>\n  <ion-fab vertical=\"top\" horizontal=\"end\" slot=\"fixed\">\n    <ion-fab-button (click)=\"categoryListPopOver($event)\">\n      <ion-icon name=\"pizza\"></ion-icon>\n    </ion-fab-button>\n  </ion-fab>\n\n  <app-loading\n              *ngIf=\"showRestaurantLoading === true\"\n              [type]=\"'restaurant-detail'\"\n  ></app-loading>\n  <app-restaurant-card\n    *ngIf=\"store != undefined\"\n    [store]=\"store\"\n    [viewType]=\"'detailedCard'\"\n  ></app-restaurant-card>\n\n  <ion-segment\n    (ionChange)=\"segmentChanged($event)\"\n    [(ngModel)]=\"currentSegment\"\n  >\n    <ion-segment-button value=\"menu\" checked>\n      <ion-label>Menu</ion-label>\n    </ion-segment-button>\n    <ion-segment-button value=\"reviews\">\n      <ion-label>Reviews</ion-label>\n    </ion-segment-button>\n    <ion-segment-button value=\"info\">\n      <ion-label>Info</ion-label>\n    </ion-segment-button>\n  </ion-segment>\n\n  <ion-slides (ionSlideDidChange)=\"slideChanged($event)\">\n    <ion-slide>\n      <ion-grid>\n        <ion-row>\n            <app-loading\n              *ngIf=\"showLoading === true\"\n              [type]=\"'product'\"\n            ></app-loading>\n        </ion-row>\n        <ion-row>\n          <ion-list *ngIf=\"store != undefined\">\n            <app-product-card\n              *ngFor=\"let stockCurrent of stockCurrents\"\n              [store]=\"store\"\n              [stockCurrent]=\"stockCurrent\"\n            ></app-product-card>\n          </ion-list>\n        </ion-row>\n      </ion-grid>\n    </ion-slide>\n    <ion-slide>\n      <app-review *ngIf=\"store != undefined\" [store]=\"store\"></app-review>\n    </ion-slide>\n    <ion-slide>\n      <ion-grid>\n        <ion-row>\n          <ion-col size=\"12\">\n            MAP HERE\n          </ion-col>\n        </ion-row>\n        <ion-row>\n          <ion-col size=\"12\">\n            <ion-text *ngIf=\"store != undefined\">\n              <p>\n                {{ store.info }}\n              </p>\n            </ion-text>\n          </ion-col>\n        </ion-row>\n      </ion-grid>\n    </ion-slide>\n  </ion-slides>\n\n  <ion-refresher slot=\"fixed\" (ionRefresh)=\"refresh($event)\">\n    <ion-refresher-content\n      pullingIcon=\"arrow-dropdown\"\n      pullingText=\"Pull to refresh\"\n      refreshingSpinner=\"circles\"\n    >\n    </ion-refresher-content>\n  </ion-refresher>\n</ion-content>\n\n<ion-footer>\n  <app-cart *ngIf=\"currentSegment === 'menu'\"></app-cart>\n</ion-footer>\n"

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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _store_page__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./store.page */ "./src/app/pages/store/store.page.ts");
/* harmony import */ var src_app_components_restaurant_card_restaurant_card_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/app/components/restaurant-card/restaurant-card.component */ "./src/app/components/restaurant-card/restaurant-card.component.ts");
/* harmony import */ var src_app_components_hotel_menu_popover_hotel_menu_popover_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/app/components/hotel-menu-popover/hotel-menu-popover.component */ "./src/app/components/hotel-menu-popover/hotel-menu-popover.component.ts");
/* harmony import */ var src_app_components_loading_loading_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/app/components/loading/loading.component */ "./src/app/components/loading/loading.component.ts");















var routes = [
    {
        path: '',
        component: _store_page__WEBPACK_IMPORTED_MODULE_11__["StorePage"]
    }
];
var StorePageModule = /** @class */ (function () {
    function StorePageModule() {
    }
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
                _components_cart_cart_component__WEBPACK_IMPORTED_MODULE_1__["CartComponent"], src_app_components_hotel_menu_popover_hotel_menu_popover_component__WEBPACK_IMPORTED_MODULE_13__["HotelMenuPopoverComponent"], src_app_components_loading_loading_component__WEBPACK_IMPORTED_MODULE_14__["LoadingComponent"]
            ]
        })
    ], StorePageModule);
    return StorePageModule;
}());



/***/ }),

/***/ "./src/app/pages/store/store.page.scss":
/*!*********************************************!*\
  !*** ./src/app/pages/store/store.page.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ion-list {\n  width: 100%;\n}\n\nion-footer {\n  background: blue;\n  color: white;\n}\n\napp-loading {\n  width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ppc2hudWovRGVza3RvcC9Xb3JrL0N1c3RvbWVyQXBwTmV3L3NyYy9hcHAvcGFnZXMvc3RvcmUvc3RvcmUucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9zdG9yZS9zdG9yZS5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFBO0FDQ0Y7O0FERUE7RUFDRSxnQkFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLFdBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3N0b3JlL3N0b3JlLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImlvbi1saXN0IHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbmlvbi1mb290ZXIge1xuICBiYWNrZ3JvdW5kOiBibHVlO1xuICBjb2xvcjogd2hpdGU7XG59XG5cbmFwcC1sb2FkaW5nIHtcbiAgd2lkdGg6IDEwMCU7XG59IiwiaW9uLWxpc3Qge1xuICB3aWR0aDogMTAwJTtcbn1cblxuaW9uLWZvb3RlciB7XG4gIGJhY2tncm91bmQ6IGJsdWU7XG4gIGNvbG9yOiB3aGl0ZTtcbn1cblxuYXBwLWxvYWRpbmcge1xuICB3aWR0aDogMTAwJTtcbn0iXX0= */"

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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_api_services_query_resource_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/api/services/query-resource.service */ "./src/app/api/services/query-resource.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var src_app_components_hotel_menu_popover_hotel_menu_popover_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/components/hotel-menu-popover/hotel-menu-popover.component */ "./src/app/components/hotel-menu-popover/hotel-menu-popover.component.ts");
/* harmony import */ var src_app_services_util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/util */ "./src/app/services/util.ts");








var StorePage = /** @class */ (function () {
    function StorePage(queryResource, route, popover, util) {
        this.queryResource = queryResource;
        this.route = route;
        this.popover = popover;
        this.util = util;
        this.stockCurrents = [];
        this.categoryStockCurrents = {};
        this.tempStockCurrents = [];
        this.currentSegment = 'menu';
        this.selectedCategory = 'All';
        this.showLoading = true;
        this.showRestaurantLoading = true;
        this.categories = [];
    }
    StorePage.prototype.ngOnInit = function () {
        this.getStoreId();
        this.getStore();
        this.getProducts(0, false);
        this.getCategories(0);
    };
    StorePage.prototype.getStoreId = function () {
        this.storeId = this.route.snapshot.paramMap.get('id');
    };
    StorePage.prototype.getStore = function () {
        var _this = this;
        this.queryResource
            .findStoreByRegisterNumberUsingGET(this.storeId)
            .subscribe(function (result) {
            console.log('Got Store', result);
            _this.store = result;
            _this.showRestaurantLoading = false;
        }, function (err) {
            _this.showRestaurantLoading = false;
            console.log('Error fetching store data', err);
        });
    };
    StorePage.prototype.getProducts = function (i, limit) {
        var _this = this;
        this.queryResource
            .findStockCurrentByStoreIdUsingGET(this.storeId)
            .subscribe(function (result) {
            if (result != null) {
                result.content.forEach(function (s) {
                    _this.stockCurrents.push(s);
                });
                _this.showLoading = false;
                i++;
                if (limit === false) {
                    if (i < result.totalPages) {
                        _this.getProducts(i, limit);
                    }
                }
            }
        }, function (err) {
            console.log('Error fetching product data', err);
            _this.showLoading = false;
        });
    };
    StorePage.prototype.getCategories = function (i) {
        var _this = this;
        this.queryResource
            .findCategoryAndCountUsingGET(this.storeId)
            .subscribe(function (result) {
            console.log('Got Categories', result);
            _this.categories = result;
            _this.categories.forEach(function (c) {
                _this.categoryStockCurrents[c.key] = [];
            });
            _this.categories.forEach(function (c) {
                _this.getProductsCategoryWise(0, c.key);
            });
        });
    };
    StorePage.prototype.getProductsCategoryWise = function (i, cname) {
        var _this = this;
        this.categories.forEach(function (c) {
            _this.queryResource.findProductByStoreIdAndCategoryNameUsingGET({
                userId: _this.storeId,
                categoryName: cname
            })
                .subscribe(function (p) {
                p.content.forEach(function (s) {
                    _this.categoryStockCurrents[cname].push(s);
                });
                ++i;
                if (i < p.totalPages) {
                    _this.getProductsCategoryWise(i, cname);
                }
                else {
                    console.log(cname, _this.categoryStockCurrents[cname]);
                }
            });
        });
    };
    StorePage.prototype.segmentChanged = function (event) {
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
    };
    StorePage.prototype.categoryListPopOver = function (ev) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var popover;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.tempStockCurrents = this.stockCurrents;
                        return [4 /*yield*/, this.popover.create({
                                component: src_app_components_hotel_menu_popover_hotel_menu_popover_component__WEBPACK_IMPORTED_MODULE_5__["HotelMenuPopoverComponent"],
                                componentProps: {
                                    categories: this.categories,
                                    storeId: this.storeId,
                                    selectedCategory: this.selectedCategory
                                },
                                event: ev,
                                translucent: true
                            })];
                    case 1:
                        popover = _a.sent();
                        popover.onDidDismiss().then(function (data) {
                            console.log(data.data.result);
                            if (data.data !== undefined) {
                                _this.selectedCategory = data.data.selectedCategory;
                                if (_this.selectedCategory === 'All') {
                                    _this.stockCurrents = _this.tempStockCurrents;
                                }
                                else {
                                    console.log('Got products');
                                    _this.stockCurrents = data.data.result.filter(function (s) { return s !== null; });
                                }
                            }
                            else {
                                _this.util.createToast('Error while Getting data');
                            }
                        });
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StorePage.prototype.slideChanged = function (event) {
        var _this = this;
        var index;
        this.ionSlides.getActiveIndex().then(function (num) {
            index = num;
            if (index === 0) {
                _this.currentSegment = 'menu';
            }
            else if (index === 1) {
                _this.currentSegment = 'reviews';
            }
            else {
                _this.currentSegment = 'info';
            }
        });
    };
    StorePage.prototype.refresh = function (event) {
        this.getProducts(0, false);
    };
    StorePage.prototype.toggleIonRefresher = function () {
        this.IonRefresher.complete();
    };
    StorePage.ctorParameters = function () { return [
        { type: src_app_api_services_query_resource_service__WEBPACK_IMPORTED_MODULE_3__["QueryResourceService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"] },
        { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["PopoverController"] },
        { type: src_app_services_util__WEBPACK_IMPORTED_MODULE_6__["Util"] }
    ]; };
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
            src_app_services_util__WEBPACK_IMPORTED_MODULE_6__["Util"]])
    ], StorePage);
    return StorePage;
}());



/***/ })

}]);
//# sourceMappingURL=pages-store-store-module-es5.js.map