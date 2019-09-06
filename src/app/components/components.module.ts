import { RazorpayPaymentComponent } from './razorpay-payment/razorpay-payment.component';
import { BraintreeCardPaymentComponent } from './braintree-card-payment/braintree-card-payment.component';
import { NotificationComponent } from './notification/notification.component';
import { PaymentSuccessfullInfoComponent } from './payment-successfull-info/payment-successfull-info.component';
import { ProcessPaymentComponent } from './process-payment/process-payment.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { FavouriteListComponent } from './favourite-list/favourite-list.component';
import { FrequentlyOrderedListComponent } from './frequently-ordered-list/frequently-ordered-list.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { AllergyComponent } from './allergy/allergy.component';
import { CartComponent } from './cart/cart.component';
import { ReviewComponent } from './review/review.component';
import { ClosedPipe } from './../pipes/closed.pipe';
import { DateDifferencePipe } from './../pipes/date-difference.pipe';
import { ArrayFormaterPipe } from './../pipes/array-formater.pipe';
import { RatingComponent } from './rating/rating.component';
import { FilterComponent } from './filter/filter.component';
import { BannerComponent } from './banner/banner.component';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-img-cropper';
import { RouterModule } from '@angular/router';
import { RestaurantCardComponent } from './restaurant-card/restaurant-card.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { StoreHeaderComponent } from './store-header/store-header.component';
import { DeliveryItemDetailsComponent } from './delivery-item-details/delivery-item-details.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { AddressListComponent } from './address-list/address-list.component';
import { LoadingComponent } from './loading/loading.component';
import { HotelMenuPopoverComponent } from './hotel-menu-popover/hotel-menu-popover.component';
import { FooterComponent } from './footer/footer.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MapComponent } from './map/map.component';
import { CategoryWiseProductsCardComponent } from './category-wise-products-card/category-wise-products-card.component';
import { ShowAuxilaryModalComponent } from './show-auxilary-modal/show-auxilary-modal.component';
import { AuxilaryProductCardComponent } from './auxilary-product-card/auxilary-product-card.component';
import { WaitInformatonPopoverComponent } from './wait-informaton-popover/wait-informaton-popover.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { PaypalPaymentComponent } from './paypal-payment/paypal-payment.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';





@NgModule({
  declarations: [

    ImageSelectorComponent,
    RatingComponent,
    LoadingComponent,
    MakePaymentComponent,
    ProcessPaymentComponent,
    PaymentSuccessfullInfoComponent,
    HeaderComponent,
    FooterComponent,
    StoreHeaderComponent,
    RestaurantCardComponent,
    ProductCardComponent,
    CartComponent,
    CheckoutComponent,
    MapComponent,
    DeliveryItemDetailsComponent,
    ReviewComponent,
    AllergyComponent,
    BannerComponent,
    FilterComponent,
    ProfileInfoComponent,
    ProfileEditComponent,
    FrequentlyOrderedListComponent,
    FavouriteListComponent,
    HistoryListComponent,
    AddressListComponent,
    HotelMenuPopoverComponent,
    CategoryWiseProductsCardComponent,
    AuxilaryProductCardComponent,
    ShowAuxilaryModalComponent,
    ArrayFormaterPipe,
    ClosedPipe,
    DateDifferencePipe,
    WaitInformatonPopoverComponent,
    NotificationComponent,
    OrderCardComponent,
    BraintreeCardPaymentComponent,
    RazorpayPaymentComponent,
    PaypalPaymentComponent,
    LoginSignupComponent

  ],

  imports: [
    ImageCropperModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    InternationalPhoneNumberModule

  ],

  exports: [

    ImageSelectorComponent,
    RatingComponent,
    LoadingComponent,
    MakePaymentComponent,
    ProcessPaymentComponent,
    PaymentSuccessfullInfoComponent,
    HeaderComponent,
    FooterComponent,
    StoreHeaderComponent,
    RestaurantCardComponent,
    ProductCardComponent,
    CartComponent,
    CheckoutComponent,
    MapComponent,
    DeliveryItemDetailsComponent,
    ReviewComponent,
    BannerComponent,
    FilterComponent,
    AllergyComponent,
    ProfileInfoComponent,
    ProfileEditComponent,
    FrequentlyOrderedListComponent,
    FavouriteListComponent,
    HistoryListComponent,
    AddressListComponent,
    HotelMenuPopoverComponent,
    CategoryWiseProductsCardComponent,
    ShowAuxilaryModalComponent,
    AuxilaryProductCardComponent,
    NotificationComponent,
    OrderCardComponent,
    BraintreeCardPaymentComponent,
    RazorpayPaymentComponent,
    PaypalPaymentComponent,
    LoginSignupComponent

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  entryComponents: [
    ImageSelectorComponent,
    ProcessPaymentComponent,
    MakePaymentComponent,
    PaymentSuccessfullInfoComponent,
    RestaurantCardComponent,
    RatingComponent,
    DeliveryItemDetailsComponent,
    AllergyComponent,
    ProfileEditComponent,
    AddressListComponent,
    LoadingComponent,
    CheckoutComponent,
    ShowAuxilaryModalComponent,
    AuxilaryProductCardComponent,
    WaitInformatonPopoverComponent,
    OrderCardComponent,
    BraintreeCardPaymentComponent,
    RazorpayPaymentComponent,
    PaypalPaymentComponent,
    LoginSignupComponent
  ]
})
export class ComponentsModule { }
