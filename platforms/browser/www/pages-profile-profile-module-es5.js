(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-profile-profile-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/profile/profile.page.html":
/*!***************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/profile/profile.page.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <ion-toolbar>\n    <ion-buttons>\n      <ion-menu-button slot=\"start\" auto-hide=\"true\"></ion-menu-button>\n      <ion-title>Profile</ion-title>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <app-profile-info *ngIf=\"customer != undefined\" \n  [customer]=\"customer\"\n  [keyCloakUser]=\"keyCloakUser\"\n  [contact]=\"contact\"\n  ></app-profile-info>\n\n  <ion-segment \n  (ionChange)=\"segmentChanged($event)\"\n  [(ngModel)]=\"currentSegment\"\n  >\n    <ion-segment-button value=\"frequently\" checked>\n      <ion-label>\n        Frequent\n      </ion-label>\n    </ion-segment-button>\n    <ion-segment-button value=\"favourite\">\n      <ion-label>\n        Favourites\n      </ion-label>\n    </ion-segment-button>\n    <ion-segment-button value=\"history\">\n      <ion-label>History</ion-label>\n    </ion-segment-button>\n  </ion-segment>\n\n  <ion-slides>\n    <ion-slide>\n      <app-frequently-ordered-list></app-frequently-ordered-list>\n    </ion-slide>\n    <ion-slide>\n      <app-favourite-list>\n      </app-favourite-list>\n    </ion-slide>\n    <ion-slide>\n      <app-history-list\n      *ngIf=\"keyCloakUser !== undefined\"\n      [keyCloakUser]=\"keyCloakUser\"\n      ></app-history-list>\n    </ion-slide>\n  </ion-slides>\n</ion-content>\n<ion-footer>\n  <app-footer></app-footer>\n</ion-footer>\n"

/***/ }),

/***/ "./src/app/pages/profile/profile.module.ts":
/*!*************************************************!*\
  !*** ./src/app/pages/profile/profile.module.ts ***!
  \*************************************************/
/*! exports provided: ProfilePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfilePageModule", function() { return ProfilePageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _components_history_list_history_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../components/history-list/history-list.component */ "./src/app/components/history-list/history-list.component.ts");
/* harmony import */ var _components_favourite_list_favourite_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../components/favourite-list/favourite-list.component */ "./src/app/components/favourite-list/favourite-list.component.ts");
/* harmony import */ var _components_frequently_ordered_list_frequently_ordered_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../components/frequently-ordered-list/frequently-ordered-list.component */ "./src/app/components/frequently-ordered-list/frequently-ordered-list.component.ts");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../components/components.module */ "./src/app/components/components.module.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _profile_page__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./profile.page */ "./src/app/pages/profile/profile.page.ts");
/* harmony import */ var src_app_components_profile_info_profile_info_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/app/components/profile-info/profile-info.component */ "./src/app/components/profile-info/profile-info.component.ts");
/* harmony import */ var src_app_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/app/components/footer/footer.component */ "./src/app/components/footer/footer.component.ts");













var routes = [
    {
        path: '',
        component: _profile_page__WEBPACK_IMPORTED_MODULE_10__["ProfilePage"]
    }
];
var ProfilePageModule = /** @class */ (function () {
    function ProfilePageModule() {
    }
    ProfilePageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_6__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormsModule"],
                _ionic_angular__WEBPACK_IMPORTED_MODULE_9__["IonicModule"],
                _components_components_module__WEBPACK_IMPORTED_MODULE_4__["ComponentsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_8__["RouterModule"].forChild(routes)
            ],
            declarations: [_profile_page__WEBPACK_IMPORTED_MODULE_10__["ProfilePage"]],
            entryComponents: [src_app_components_profile_info_profile_info_component__WEBPACK_IMPORTED_MODULE_11__["ProfileInfoComponent"], _components_frequently_ordered_list_frequently_ordered_list_component__WEBPACK_IMPORTED_MODULE_3__["FrequentlyOrderedListComponent"], _components_favourite_list_favourite_list_component__WEBPACK_IMPORTED_MODULE_2__["FavouriteListComponent"],
                _components_history_list_history_list_component__WEBPACK_IMPORTED_MODULE_1__["HistoryListComponent"], src_app_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_12__["FooterComponent"]]
        })
    ], ProfilePageModule);
    return ProfilePageModule;
}());



/***/ }),

/***/ "./src/app/pages/profile/profile.page.scss":
/*!*************************************************!*\
  !*** ./src/app/pages/profile/profile.page.scss ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "app-favourite-list, app-frequently-ordered-list {\n  width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ppc2hudWovRGVza3RvcC9Xb3JrL0N1c3RvbWVyQXBwTGF0ZXN0L3NyYy9hcHAvcGFnZXMvcHJvZmlsZS9wcm9maWxlLnBhZ2Uuc2NzcyIsInNyYy9hcHAvcGFnZXMvcHJvZmlsZS9wcm9maWxlLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFdBQUE7QUNDSiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3Byb2ZpbGUvcHJvZmlsZS5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJhcHAtZmF2b3VyaXRlLWxpc3QgLCBhcHAtZnJlcXVlbnRseS1vcmRlcmVkLWxpc3Qge1xuICAgIHdpZHRoOiAxMDAlO1xufSIsImFwcC1mYXZvdXJpdGUtbGlzdCwgYXBwLWZyZXF1ZW50bHktb3JkZXJlZC1saXN0IHtcbiAgd2lkdGg6IDEwMCU7XG59Il19 */"

/***/ }),

/***/ "./src/app/pages/profile/profile.page.ts":
/*!***********************************************!*\
  !*** ./src/app/pages/profile/profile.page.ts ***!
  \***********************************************/
/*! exports provided: ProfilePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfilePage", function() { return ProfilePage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ionic_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/storage */ "./node_modules/@ionic/storage/fesm5/ionic-storage.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var src_app_api_services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/api/services */ "./src/app/api/services.ts");
/* harmony import */ var ngx_logger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-logger */ "./node_modules/ngx-logger/fesm5/ngx-logger.js");
/* harmony import */ var src_app_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/components/footer/footer.component */ "./src/app/components/footer/footer.component.ts");







var ProfilePage = /** @class */ (function () {
    function ProfilePage(storage, queryResource, logger) {
        this.storage = storage;
        this.queryResource = queryResource;
        this.logger = logger;
        this.currentSegment = 'frequently';
    }
    ProfilePage.prototype.ngOnInit = function () {
        this.getUserProfile();
    };
    ProfilePage.prototype.segmentChanged = function (event) {
        if (event.detail.value === 'frequently') {
            this.ionSlides.slideTo(0);
        }
        else if (event.detail.value === 'favourite') {
            this.ionSlides.slideTo(1);
        }
        else {
            this.ionSlides.slideTo(2);
        }
    };
    ProfilePage.prototype.slideChanged = function (event) {
        var _this = this;
        var index;
        this.ionSlides.getActiveIndex().then(function (num) {
            index = num;
            if (index === 0) {
                _this.currentSegment = 'frequently';
            }
            else if (index === 1) {
                _this.currentSegment = 'favourite';
            }
            else {
                _this.currentSegment = 'history';
            }
        });
    };
    ProfilePage.prototype.getUserProfile = function () {
        var _this = this;
        this.storage.get('user')
            .then(function (user) {
            _this.keyCloakUser = user;
            _this.queryResource.findCustomerByReferenceUsingGET(user.preferred_username)
                .subscribe(function (customer) {
                _this.customer = customer;
                _this.queryResource.findContactByIdUsingGET(_this.customer.contactId)
                    .subscribe(function (contact) {
                    _this.contact = contact;
                });
            });
        });
    };
    // Fix for Footer Button Change
    ProfilePage.prototype.ionViewDidEnter = function () {
        this.logger.info('Ion View Did enter');
        this.footer.setcurrentRoute('profile');
    };
    ProfilePage.ctorParameters = function () { return [
        { type: _ionic_storage__WEBPACK_IMPORTED_MODULE_1__["Storage"] },
        { type: src_app_api_services__WEBPACK_IMPORTED_MODULE_4__["QueryResourceService"] },
        { type: ngx_logger__WEBPACK_IMPORTED_MODULE_5__["NGXLogger"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonSlides"], null),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonSlides"])
    ], ProfilePage.prototype, "ionSlides", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(src_app_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_6__["FooterComponent"], null),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_app_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_6__["FooterComponent"])
    ], ProfilePage.prototype, "footer", void 0);
    ProfilePage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-profile',
            template: __webpack_require__(/*! raw-loader!./profile.page.html */ "./node_modules/raw-loader/index.js!./src/app/pages/profile/profile.page.html"),
            styles: [__webpack_require__(/*! ./profile.page.scss */ "./src/app/pages/profile/profile.page.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ionic_storage__WEBPACK_IMPORTED_MODULE_1__["Storage"],
            src_app_api_services__WEBPACK_IMPORTED_MODULE_4__["QueryResourceService"],
            ngx_logger__WEBPACK_IMPORTED_MODULE_5__["NGXLogger"]])
    ], ProfilePage);
    return ProfilePage;
}());



/***/ })

}]);
//# sourceMappingURL=pages-profile-profile-module-es5.js.map