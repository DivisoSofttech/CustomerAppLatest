(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-basket-basket-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/basket/basket.page.html":
/*!*************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/basket/basket.page.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <ion-toolbar>\n    <ion-buttons>\n      <ion-menu-button slot=\"start\" auto-hide=\"true\"></ion-menu-button>\n      <ion-title>Basket</ion-title>\n    </ion-buttons>\n    <ion-buttons slot=\"end\">\n      <ion-button (click)=\"clearCart()\">\n        <ion-icon name=\"refresh-circle\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <app-cart\n    *ngIf=\"store !== undefined\"\n    [store]=\"store\"\n    [viewType]=\"'full'\"\n  ></app-cart>\n</ion-content>\n"

/***/ }),

/***/ "./src/app/pages/basket/basket.module.ts":
/*!***********************************************!*\
  !*** ./src/app/pages/basket/basket.module.ts ***!
  \***********************************************/
/*! exports provided: BasketPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BasketPageModule", function() { return BasketPageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _components_cart_cart_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../components/cart/cart.component */ "./src/app/components/cart/cart.component.ts");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../components/components.module */ "./src/app/components/components.module.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _basket_page__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./basket.page */ "./src/app/pages/basket/basket.page.ts");









const routes = [
    {
        path: '',
        component: _basket_page__WEBPACK_IMPORTED_MODULE_8__["BasketPage"]
    }
];
let BasketPageModule = class BasketPageModule {
};
BasketPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_7__["IonicModule"],
            _components_components_module__WEBPACK_IMPORTED_MODULE_2__["ComponentsModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterModule"].forChild(routes)
        ],
        declarations: [_basket_page__WEBPACK_IMPORTED_MODULE_8__["BasketPage"]],
        entryComponents: [_components_cart_cart_component__WEBPACK_IMPORTED_MODULE_1__["CartComponent"]]
    })
], BasketPageModule);



/***/ }),

/***/ "./src/app/pages/basket/basket.page.scss":
/*!***********************************************!*\
  !*** ./src/app/pages/basket/basket.page.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Jhc2tldC9iYXNrZXQucGFnZS5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/pages/basket/basket.page.ts":
/*!*********************************************!*\
  !*** ./src/app/pages/basket/basket.page.ts ***!
  \*********************************************/
/*! exports provided: BasketPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BasketPage", function() { return BasketPage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var src_app_api_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/api/services */ "./src/app/api/services.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_services_cart_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/cart.service */ "./src/app/services/cart.service.ts");




let BasketPage = class BasketPage {
    constructor(cart, queryResource) {
        this.cart = cart;
        this.queryResource = queryResource;
        this.store = {};
    }
    ngOnInit() {
        if (this.cart.currentShop !== undefined) {
            this.getStore();
        }
    }
    getStore() {
        console.log('Basket Page Getting Store', this.cart.currentShop.regNo);
        this.queryResource.findStoreByRegisterNumberUsingGET(this.cart.currentShop.regNo)
            .subscribe(store => {
            this.store = store;
        });
    }
    clearCart() {
        this.cart.emptyCart();
    }
};
BasketPage.ctorParameters = () => [
    { type: src_app_services_cart_service__WEBPACK_IMPORTED_MODULE_3__["CartService"] },
    { type: src_app_api_services__WEBPACK_IMPORTED_MODULE_1__["QueryResourceService"] }
];
BasketPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-basket',
        template: __webpack_require__(/*! raw-loader!./basket.page.html */ "./node_modules/raw-loader/index.js!./src/app/pages/basket/basket.page.html"),
        styles: [__webpack_require__(/*! ./basket.page.scss */ "./src/app/pages/basket/basket.page.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_cart_service__WEBPACK_IMPORTED_MODULE_3__["CartService"],
        src_app_api_services__WEBPACK_IMPORTED_MODULE_1__["QueryResourceService"]])
], BasketPage);



/***/ })

}]);
//# sourceMappingURL=pages-basket-basket-module-es2015.js.map