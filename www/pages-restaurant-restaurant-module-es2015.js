(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-restaurant-restaurant-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/restaurant/restaurant.page.html":
/*!*********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/restaurant/restaurant.page.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <app-header (placeChanged)=\"updatedLocation($event)\"></app-header>\n</ion-header>\n<ion-content>\n\n    <app-banner ></app-banner>\n\n    <ion-list>\n      <div class=\"highlightText\">\n        <ion-label>\n          <h2>What's Nearby!</h2>\n        </ion-label>\n      </div>\n      <app-restaurant-card \n      *ngFor=\"let store of stores\"\n      [store]=\"store\"\n      ></app-restaurant-card>\n\n    </ion-list>\n\n    <ion-infinite-scroll threshold=\"100px\" (ionInfinite)=\"loadMoreStores($event)\">\n      <ion-infinite-scroll-content loadingSpinner=\"bubbles\" loadingText=\"Loading more data...\">\n      </ion-infinite-scroll-content>\n    </ion-infinite-scroll>\n    <ion-refresher slot=\"fixed\" (ionRefresh)=\"doRefresh($event)\">\n      <ion-refresher-content pullingIcon=\"arrow-dropdown\" pullingText=\"Pull to refresh\" refreshingSpinner=\"circles\">\n      </ion-refresher-content>\n    </ion-refresher>\n\n</ion-content>\n<ion-footer>\n  <app-filter *ngIf=\"showFilters\" (closeFilter)=\"toggleFilteromponent()\"></app-filter>\n  <ion-buttons float-right *ngIf=\"showFilters === false\">\n    <ion-button slot=\"end\" (click)=\"toggleFilteromponent()\">\n      <ion-icon name=\"funnel\"></ion-icon>\n    </ion-button>\n  </ion-buttons>\n</ion-footer>"

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
        entryComponents: [_components_header_header_component__WEBPACK_IMPORTED_MODULE_3__["HeaderComponent"], _components_banner_banner_component__WEBPACK_IMPORTED_MODULE_2__["BannerComponent"], src_app_components_restaurant_card_restaurant_card_component__WEBPACK_IMPORTED_MODULE_11__["RestaurantCardComponent"], _components_filter_filter_component__WEBPACK_IMPORTED_MODULE_1__["FilterComponent"]]
    })
], RestaurantPageModule);



/***/ }),

/***/ "./src/app/pages/restaurant/restaurant.page.scss":
/*!*******************************************************!*\
  !*** ./src/app/pages/restaurant/restaurant.page.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".highlightText {\n  padding: 3px 13px;\n  background: lightgrey;\n}\n\nh2 {\n  font-size: 18px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ppc2hudWovRGVza3RvcC9Xb3JrL0N1c3RvbWVyQXBwTmV3L3NyYy9hcHAvcGFnZXMvcmVzdGF1cmFudC9yZXN0YXVyYW50LnBhZ2Uuc2NzcyIsInNyYy9hcHAvcGFnZXMvcmVzdGF1cmFudC9yZXN0YXVyYW50LnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0VBQ0EscUJBQUE7QUNDSjs7QURFQTtFQUNJLGVBQUE7QUNDSiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3Jlc3RhdXJhbnQvcmVzdGF1cmFudC5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaGlnaGxpZ2h0VGV4dCB7XG4gICAgcGFkZGluZzogM3B4IDEzcHg7XG4gICAgYmFja2dyb3VuZDpsaWdodGdyZXk7XG59XG5cbmgyIHtcbiAgICBmb250LXNpemU6IDE4cHg7XG59IiwiLmhpZ2hsaWdodFRleHQge1xuICBwYWRkaW5nOiAzcHggMTNweDtcbiAgYmFja2dyb3VuZDogbGlnaHRncmV5O1xufVxuXG5oMiB7XG4gIGZvbnQtc2l6ZTogMThweDtcbn0iXX0= */"

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



let RestaurantPage = class RestaurantPage {
    constructor(filter) {
        this.filter = filter;
        this.showFilters = false;
        this.page = 0;
        this.stores = [];
    }
    ngOnInit() {
        this.getStores();
    }
    updatedLocation(event) {
        console.log(event);
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
    doRefresh(event) { }
    toggleInfiniteScroll() { }
    toggleFilteromponent() {
        this.showFilters = !this.showFilters;
    }
};
RestaurantPage.ctorParameters = () => [
    { type: _services_filter_service__WEBPACK_IMPORTED_MODULE_1__["FilterService"] }
];
RestaurantPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: "app-restaurant",
        template: __webpack_require__(/*! raw-loader!./restaurant.page.html */ "./node_modules/raw-loader/index.js!./src/app/pages/restaurant/restaurant.page.html"),
        styles: [__webpack_require__(/*! ./restaurant.page.scss */ "./src/app/pages/restaurant/restaurant.page.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_filter_service__WEBPACK_IMPORTED_MODULE_1__["FilterService"]])
], RestaurantPage);



/***/ })

}]);
//# sourceMappingURL=pages-restaurant-restaurant-module-es2015.js.map