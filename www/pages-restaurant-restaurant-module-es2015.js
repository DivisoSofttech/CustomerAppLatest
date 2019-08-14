(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-restaurant-restaurant-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/restaurant/restaurant.page.html":
/*!*********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/restaurant/restaurant.page.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <app-header (placeChanged)=\"updatedLocation($event)\"></app-header>\n</ion-header>\n<ion-content>\n  <app-map></app-map>\n  <app-banner></app-banner>\n\n  <ion-list>\n    <div class=\"highlightText\">\n      <ion-label>\n        <h2>What's Nearby!</h2>\n      </ion-label>\n    </div>\n    <app-restaurant-card\n      *ngFor=\"let store of stores\"\n      [store]=\"store\"\n    ></app-restaurant-card>\n  </ion-list>\n\n  <app-loading *ngIf=\"showLoading === true\" [type]=\"'restaurant'\"></app-loading>\n\n  <ion-infinite-scroll threshold=\"100px\" (ionInfinite)=\"loadMoreStores($event)\">\n    <ion-infinite-scroll-content\n      loadingSpinner=\"bubbles\"\n      loadingText=\"Loading more data...\"\n    >\n    </ion-infinite-scroll-content>\n  </ion-infinite-scroll>\n  <ion-refresher slot=\"fixed\" (ionRefresh)=\"doRefresh($event)\">\n    <ion-refresher-content\n      pullingIcon=\"arrow-dropdown\"\n      pullingText=\"Pull to refresh\"\n      refreshingSpinner=\"circles\"\n    >\n    </ion-refresher-content>\n  </ion-refresher>\n</ion-content>\n<ion-footer>\n  <app-filter\n    *ngIf=\"showFilters\"\n    (closeFilter)=\"toggleFilteromponent()\"\n  ></app-filter>\n  <app-footer (filter)=\"toggleFilteromponent()\"></app-footer>\n</ion-footer>\n"

/***/ }),

/***/ "./src/app/pages/restaurant/restaurant.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/pages/restaurant/restaurant.module.ts ***!
  \*******************************************************/
/*! exports provided: RestaurantPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RestaurantPageModule", function() { return RestaurantPageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _components_filter_filter_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../components/filter/filter.component */ "./src/app/components/filter/filter.component.ts");
/* harmony import */ var _components_banner_banner_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../components/banner/banner.component */ "./src/app/components/banner/banner.component.ts");
/* harmony import */ var _components_header_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../components/header/header.component */ "./src/app/components/header/header.component.ts");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../components/components.module */ "./src/app/components/components.module.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _restaurant_page__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./restaurant.page */ "./src/app/pages/restaurant/restaurant.page.ts");
/* harmony import */ var src_app_components_restaurant_card_restaurant_card_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/app/components/restaurant-card/restaurant-card.component */ "./src/app/components/restaurant-card/restaurant-card.component.ts");
/* harmony import */ var src_app_components_loading_loading_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/app/components/loading/loading.component */ "./src/app/components/loading/loading.component.ts");
/* harmony import */ var src_app_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/app/components/footer/footer.component */ "./src/app/components/footer/footer.component.ts");
/* harmony import */ var src_app_components_map_map_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/app/components/map/map.component */ "./src/app/components/map/map.component.ts");















const routes = [
    {
        path: '',
        component: _restaurant_page__WEBPACK_IMPORTED_MODULE_10__["RestaurantPage"]
    }
];
let RestaurantPageModule = class RestaurantPageModule {
};
RestaurantPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_6__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_9__["IonicModule"],
            _components_components_module__WEBPACK_IMPORTED_MODULE_4__["ComponentsModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_8__["RouterModule"].forChild(routes)
        ],
        declarations: [_restaurant_page__WEBPACK_IMPORTED_MODULE_10__["RestaurantPage"]],
        entryComponents: [_components_header_header_component__WEBPACK_IMPORTED_MODULE_3__["HeaderComponent"], src_app_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_13__["FooterComponent"], _components_banner_banner_component__WEBPACK_IMPORTED_MODULE_2__["BannerComponent"], src_app_components_restaurant_card_restaurant_card_component__WEBPACK_IMPORTED_MODULE_11__["RestaurantCardComponent"],
            _components_filter_filter_component__WEBPACK_IMPORTED_MODULE_1__["FilterComponent"], src_app_components_loading_loading_component__WEBPACK_IMPORTED_MODULE_12__["LoadingComponent"], src_app_components_map_map_component__WEBPACK_IMPORTED_MODULE_14__["MapComponent"]]
    })
], RestaurantPageModule);



/***/ }),

/***/ "./src/app/pages/restaurant/restaurant.page.scss":
/*!*******************************************************!*\
  !*** ./src/app/pages/restaurant/restaurant.page.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".highlightText {\n  padding: 3px 13px;\n  background: #f8f4f4;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ppc2hudWovRGVza3RvcC9Xb3JrL0N1c3RvbWVyQXBwTmV3L3NyYy9hcHAvcGFnZXMvcmVzdGF1cmFudC9yZXN0YXVyYW50LnBhZ2Uuc2NzcyIsInNyYy9hcHAvcGFnZXMvcmVzdGF1cmFudC9yZXN0YXVyYW50LnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGlCQUFBO0VBQ0EsbUJBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3Jlc3RhdXJhbnQvcmVzdGF1cmFudC5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaGlnaGxpZ2h0VGV4dCB7XG4gIHBhZGRpbmc6IDNweCAxM3B4O1xuICBiYWNrZ3JvdW5kOiAjZjhmNGY0O1xufVxuIiwiLmhpZ2hsaWdodFRleHQge1xuICBwYWRkaW5nOiAzcHggMTNweDtcbiAgYmFja2dyb3VuZDogI2Y4ZjRmNDtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/pages/restaurant/restaurant.page.ts":
/*!*****************************************************!*\
  !*** ./src/app/pages/restaurant/restaurant.page.ts ***!
  \*****************************************************/
/*! exports provided: RestaurantPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RestaurantPage", function() { return RestaurantPage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _services_filter_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../services/filter.service */ "./src/app/services/filter.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_services_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/util */ "./src/app/services/util.ts");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");





let RestaurantPage = class RestaurantPage {
    constructor(filter, util) {
        this.filter = filter;
        this.util = util;
        this.showLoading = true;
        this.showFilters = false;
        this.page = 0;
        this.stores = [];
    }
    ngOnInit() {
        this.getStores();
    }
    updatedLocation(event) {
        console.log('Location Changed', event);
        this.filter.currentCordinates = event.latLon;
        this.filter.setFilter(_services_filter_service__WEBPACK_IMPORTED_MODULE_1__["FILTER_TYPES"].DISTANCE_WISE);
    }
    getStores() {
        this.filter.getSubscription().subscribe(data => {
            console.log(data);
            this.stores = [];
            this.filter.getStores(0, (totalElements, totalPages, stores) => {
                if (totalPages === 1) {
                    console.log('Disabling Infinite Scroll');
                    this.toggleInfiniteScroll();
                }
                console.log(stores);
                stores.forEach(s => {
                    this.stores.push(s);
                });
                this.showLoading = false;
                this.toggleIonRefresher();
            });
        });
    }
    loadMoreStores(event) {
        this.page++;
        this.filter.getStores(this.page, (totalElements, totalPages, stores) => {
            if (this.page === totalPages) {
                this.toggleInfiniteScroll();
            }
            if (totalPages === 1) {
                this.toggleInfiniteScroll();
            }
            else {
                console.log(stores);
                stores.forEach(s => {
                    this.stores.push(s);
                });
            }
        });
    }
    doRefresh(event) {
        this.getStores();
    }
    toggleInfiniteScroll() {
        this.ionInfiniteScroll.disabled = !this.ionInfiniteScroll.disabled;
    }
    toggleIonRefresher() {
        this.IonRefresher.complete();
    }
    toggleFilteromponent() {
        this.showFilters = !this.showFilters;
    }
};
RestaurantPage.ctorParameters = () => [
    { type: _services_filter_service__WEBPACK_IMPORTED_MODULE_1__["FilterService"] },
    { type: src_app_services_util__WEBPACK_IMPORTED_MODULE_3__["Util"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonInfiniteScroll"], null),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonInfiniteScroll"])
], RestaurantPage.prototype, "ionInfiniteScroll", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonRefresher"], null),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonRefresher"])
], RestaurantPage.prototype, "IonRefresher", void 0);
RestaurantPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-restaurant',
        template: __webpack_require__(/*! raw-loader!./restaurant.page.html */ "./node_modules/raw-loader/index.js!./src/app/pages/restaurant/restaurant.page.html"),
        styles: [__webpack_require__(/*! ./restaurant.page.scss */ "./src/app/pages/restaurant/restaurant.page.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_filter_service__WEBPACK_IMPORTED_MODULE_1__["FilterService"],
        src_app_services_util__WEBPACK_IMPORTED_MODULE_3__["Util"]])
], RestaurantPage);



/***/ })

}]);
//# sourceMappingURL=pages-restaurant-restaurant-module-es2015.js.map