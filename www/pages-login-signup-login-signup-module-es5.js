(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-login-signup-login-signup-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/login-signup/login-signup.page.html":
/*!*************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/login-signup/login-signup.page.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n    <ion-toolbar>\n      <ion-title>Login</ion-title>\n    </ion-toolbar>\n  </ion-header>\n  \n  <ion-segment (ionChange)=\"slide($event)\" [value]=\"value\" class=\"mobile\">\n    <ion-segment-button value=\"login\">\n      <ion-label>Login</ion-label>\n    </ion-segment-button>\n    <ion-segment-button value=\"signup\">\n      <ion-label>Register</ion-label>\n    </ion-segment-button>\n  </ion-segment>\n  \n  <ion-content padding class=\"mobile\">\n    <ion-slides #slides (ionSlideDidChange)=\"slideChange()\">\n      <ion-slide>\n        <ion-grid margin-top>\n          <ion-row justify-content-center text-center class=\"centre\">\n            <ion-col size=\"6\" justify-content-center>\n              <div class=\"circle\">\n                <ion-icon class=\"large-icon\" name=\"person\"></ion-icon>\n              </div>\n            </ion-col>\n          </ion-row>\n          <ion-row justify-content-center class=\"centre\">\n            <ion-col text-center class=\"container-box\">\n              <ion-item class=\"item-inner\">\n                <ion-label color=\"medium\" position=\"floating\">Username or Email</ion-label>\n                <ion-input [(ngModel)]=\"username\" background=\"light\"></ion-input>\n              </ion-item>\n              <ion-item class=\"item-inner\">\n                <ion-label color=\"medium\" position=\"floating\">Password</ion-label>\n                <ion-input [(ngModel)]=\"password\" type=\"password\"></ion-input>\n              </ion-item>\n              <ion-button [disabled]=\"loginDisabled()\" (click)=\"login()\" expand=\"block\" margin-top margin-bottom>Login\n              </ion-button>\n            </ion-col>\n          </ion-row>\n        </ion-grid>\n      </ion-slide>\n      <ion-slide>\n        <ion-grid margin-top>\n          <ion-row justify-content-center>\n            <ion-col size=\"6\" text-center>\n              <div class=\"circle\">\n                <ion-icon class=\"large-icon\" name=\"person\"></ion-icon>\n              </div>\n            </ion-col>\n          </ion-row>\n          <ion-row justify-content-center class=\"centre\">\n            <ion-col text-center class=\"container-box\">\n              <ion-item class=\"item-inner\">\n                <ion-label color=\"medium\" position=\"floating\">Username</ion-label>\n                <ion-input [(ngModel)]=\"username\" background=\"light\"></ion-input>\n              </ion-item>\n              <ion-item class=\"item-inner\">\n                <ion-label color=\"medium\" position=\"floating\">Email</ion-label>\n                <ion-input [(ngModel)]=\"email\" background=\"light\"></ion-input>\n              </ion-item>\n              <ion-item class=\"item-inner\">\n                <ion-label color=\"medium\" position=\"floating\">Password</ion-label>\n                <ion-input [(ngModel)]=\"password\" type=\"password\"></ion-input>\n              </ion-item>\n              <ion-button [disabled]=\"registerDisabled()\" (click)=\"signup()\" expand=\"block\" margin-top margin-bottom>\n                Register</ion-button>\n            </ion-col>\n          </ion-row>\n        </ion-grid>\n      </ion-slide>\n    </ion-slides>\n  </ion-content>\n"

/***/ }),

/***/ "./src/app/pages/login-signup/login-signup.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/pages/login-signup/login-signup.module.ts ***!
  \***********************************************************/
/*! exports provided: LoginSignupPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginSignupPageModule", function() { return LoginSignupPageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _login_signup_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./login-signup.page */ "./src/app/pages/login-signup/login-signup.page.ts");







var routes = [
    {
        path: '',
        component: _login_signup_page__WEBPACK_IMPORTED_MODULE_6__["LoginSignupPage"]
    }
];
var LoginSignupPageModule = /** @class */ (function () {
    function LoginSignupPageModule() {
    }
    LoginSignupPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonicModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forChild(routes)
            ],
            declarations: [_login_signup_page__WEBPACK_IMPORTED_MODULE_6__["LoginSignupPage"]]
        })
    ], LoginSignupPageModule);
    return LoginSignupPageModule;
}());



/***/ }),

/***/ "./src/app/pages/login-signup/login-signup.page.scss":
/*!***********************************************************!*\
  !*** ./src/app/pages/login-signup/login-signup.page.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".cursor {\n  cursor: pointer;\n}\n\n.large-icon {\n  font-size: 125px;\n  opacity: 0.4;\n}\n\n.circle {\n  display: inline-block;\n  background-color: aliceblue;\n  border-radius: 50%;\n  height: 135px;\n  width: 135px;\n}\n\n.centre {\n  text-align: center;\n}\n\n.container-box {\n  width: 100%;\n  max-width: 750px;\n  display: inline-block;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ppc2hudWovRGVza3RvcC9Xb3JrL0N1c3RvbWVyQXBwTmV3L3NyYy9hcHAvcGFnZXMvbG9naW4tc2lnbnVwL2xvZ2luLXNpZ251cC5wYWdlLnNjc3MiLCJzcmMvYXBwL3BhZ2VzL2xvZ2luLXNpZ251cC9sb2dpbi1zaWdudXAucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksZUFBQTtBQ0NKOztBREVBO0VBQ0ksZ0JBQUE7RUFDQSxZQUFBO0FDQ0o7O0FERUE7RUFDSSxxQkFBQTtFQUNBLDJCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtBQ0NKOztBREVBO0VBQ0ksa0JBQUE7QUNDSjs7QURFQTtFQUNJLFdBQUE7RUFDQSxnQkFBQTtFQUNBLHFCQUFBO0FDQ0oiLCJmaWxlIjoic3JjL2FwcC9wYWdlcy9sb2dpbi1zaWdudXAvbG9naW4tc2lnbnVwLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jdXJzb3Ige1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmxhcmdlLWljb24ge1xuICAgIGZvbnQtc2l6ZTogMTI1cHg7XG4gICAgb3BhY2l0eTogLjQ7XG59XG5cbi5jaXJjbGUge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGhlaWdodDogMTM1cHg7XG4gICAgd2lkdGg6IDEzNXB4O1xufVxuXG4uY2VudHJlIHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5jb250YWluZXItYm94IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDc1MHB4O1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cbiIsIi5jdXJzb3Ige1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5sYXJnZS1pY29uIHtcbiAgZm9udC1zaXplOiAxMjVweDtcbiAgb3BhY2l0eTogMC40O1xufVxuXG4uY2lyY2xlIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgaGVpZ2h0OiAxMzVweDtcbiAgd2lkdGg6IDEzNXB4O1xufVxuXG4uY2VudHJlIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uY29udGFpbmVyLWJveCB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IDc1MHB4O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59Il19 */"

/***/ }),

/***/ "./src/app/pages/login-signup/login-signup.page.ts":
/*!*********************************************************!*\
  !*** ./src/app/pages/login-signup/login-signup.page.ts ***!
  \*********************************************************/
/*! exports provided: LoginSignupPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginSignupPage", function() { return LoginSignupPage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _services_security_keycloak_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../services/security/keycloak.service */ "./src/app/services/security/keycloak.service.ts");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_api_services_query_resource_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/api/services/query-resource.service */ "./src/app/api/services/query-resource.service.ts");
/* harmony import */ var src_app_api_services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/api/services */ "./src/app/api/services.ts");
/* harmony import */ var src_app_services_util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/util */ "./src/app/services/util.ts");
/* harmony import */ var src_app_api_api_configuration__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/api/api-configuration */ "./src/app/api/api-configuration.ts");








var LoginSignupPage = /** @class */ (function () {
    function LoginSignupPage(keycloakService, queryResourceService, commandResourceService, util, apiConfiguration, menuController) {
        this.keycloakService = keycloakService;
        this.queryResourceService = queryResourceService;
        this.commandResourceService = commandResourceService;
        this.util = util;
        this.apiConfiguration = apiConfiguration;
        this.menuController = menuController;
        this.username = '';
        this.password = '';
        this.email = '';
        this.loginTab = true;
        this.value = 'login';
    }
    LoginSignupPage.prototype.ngOnInit = function () {
        this.isLoggedIn();
        // this.menuController.enable(false);
    };
    // Login and Register Methods
    LoginSignupPage.prototype.login = function () {
        var _this = this;
        this.util.createLoader()
            .then(function (loader) {
            loader.present();
            _this.keycloakService.authenticate({ username: _this.username, password: _this.password }, function () {
                loader.dismiss();
                _this.createUserIfNotExists(_this.username);
                _this.util.navigateRoot();
            }, function () {
                loader.dismiss();
                _this.util.createToast('Invalid Username / Password');
            });
        });
    };
    LoginSignupPage.prototype.signup = function () {
        var _this = this;
        this.util.createLoader()
            .then(function (loader) {
            loader.present();
            var user = { username: _this.username, email: _this.email };
            _this.keycloakService.createAccount(user, _this.password, function (res) {
                loader.dismiss();
                _this.login();
            }, function (err) {
                loader.dismiss();
                if (err.response.status === 409) {
                    _this.util.createToast('User Already Exists');
                    _this.slideChange();
                }
                else {
                    _this.util.createToast('Cannot Register User. Please Try Later');
                }
            });
            // Remove this later
        });
    };
    LoginSignupPage.prototype.isLoggedIn = function () {
        var _this = this;
        this.keycloakService
            .isAuthenticated()
            .then(function () {
            _this.util.navigateRoot();
        })
            .catch(function () {
            console.log('Not Logged In');
        });
    };
    LoginSignupPage.prototype.createUserIfNotExists = function (reference) {
        var _this = this;
        this.util.createLoader().then(function (loader) {
            loader.present();
            console.log('Checking if User Exists in MicroService Else Create');
            _this.queryResourceService
                .findCustomerByReferenceUsingGET(reference)
                .subscribe(function (customer) {
                console.log('Got Customer', customer);
                loader.dismiss();
                _this.util.navigateRoot();
            }, function (err) {
                if (err.status === 500) {
                    // Check if server is reachable
                    var url = _this.apiConfiguration.rootUrl.slice(2, _this.apiConfiguration.rootUrl.length);
                    _this.commandResourceService
                        .createCustomerUsingPOST({
                        reference: _this.username,
                        name: _this.username
                    })
                        .subscribe(function (customer) {
                        console.log('Customer Created', customer);
                        loader.dismiss();
                        _this.util.navigateRoot();
                    }, function (eror) {
                        console.log(eror);
                        loader.dismiss();
                        _this.util.createToast('Server is Unreachable');
                    });
                }
                else {
                    loader.dismiss();
                }
            });
        });
    };
    // View Related Methods
    LoginSignupPage.prototype.loginDisabled = function () {
        if (this.username === '' || this.password === '') {
            return true;
        }
        else {
            return false;
        }
    };
    LoginSignupPage.prototype.registerDisabled = function () {
        if (this.username === '' || this.password === '' || this.email === '') {
            return true;
        }
        else {
            return false;
        }
    };
    LoginSignupPage.prototype.slide = function (value) {
        this.value = value.detail.value;
        if (this.value === 'login') {
            this.slides.slideTo(0);
        }
        else {
            this.slides.slideTo(1);
        }
    };
    LoginSignupPage.prototype.slideChange = function () {
        var _this = this;
        var currentSlide;
        this.slides.getActiveIndex().then(function (num) {
            currentSlide = num;
            if (_this.value === 'login' && currentSlide !== 0) {
                _this.value = 'signup';
            }
            else if (_this.value === 'signup' && currentSlide !== 1) {
                _this.value = 'login';
            }
        });
    };
    LoginSignupPage.prototype.setSlideValue = function () {
        this.slideChange();
        return 1;
    };
    LoginSignupPage.ctorParameters = function () { return [
        { type: _services_security_keycloak_service__WEBPACK_IMPORTED_MODULE_1__["KeycloakService"] },
        { type: src_app_api_services_query_resource_service__WEBPACK_IMPORTED_MODULE_4__["QueryResourceService"] },
        { type: src_app_api_services__WEBPACK_IMPORTED_MODULE_5__["CommandResourceService"] },
        { type: src_app_services_util__WEBPACK_IMPORTED_MODULE_6__["Util"] },
        { type: src_app_api_api_configuration__WEBPACK_IMPORTED_MODULE_7__["ApiConfiguration"] },
        { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["MenuController"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('slides', null),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["IonSlides"])
    ], LoginSignupPage.prototype, "slides", void 0);
    LoginSignupPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'app-login-signup',
            template: __webpack_require__(/*! raw-loader!./login-signup.page.html */ "./node_modules/raw-loader/index.js!./src/app/pages/login-signup/login-signup.page.html"),
            styles: [__webpack_require__(/*! ./login-signup.page.scss */ "./src/app/pages/login-signup/login-signup.page.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_security_keycloak_service__WEBPACK_IMPORTED_MODULE_1__["KeycloakService"],
            src_app_api_services_query_resource_service__WEBPACK_IMPORTED_MODULE_4__["QueryResourceService"],
            src_app_api_services__WEBPACK_IMPORTED_MODULE_5__["CommandResourceService"],
            src_app_services_util__WEBPACK_IMPORTED_MODULE_6__["Util"],
            src_app_api_api_configuration__WEBPACK_IMPORTED_MODULE_7__["ApiConfiguration"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["MenuController"]])
    ], LoginSignupPage);
    return LoginSignupPage;
}());



/***/ })

}]);
//# sourceMappingURL=pages-login-signup-login-signup-module-es5.js.map