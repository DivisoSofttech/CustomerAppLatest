import { Component, OnInit, EventEmitter, Output, OnDestroy, Input, ViewChild } from '@angular/core';
import { NavController, IonSegment, Platform, ModalController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { NGXLogger } from 'ngx-logger';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit , OnDestroy {

  @Output() filter = new EventEmitter();

  @ViewChild(IonSegment , null) ionSegment: IonSegment;

  orderCount  = 0;
  showTabs = true;
  cartSubscription;

  @Input() filterHide = false;

  guest = true;

  constructor(
    private storage: Storage,
    private navController: NavController,
    private logger: NGXLogger,
    private cart: CartService,
    private platform: Platform,
    private router: ActivatedRoute,
    private modalController: ModalController,
    private keycloak: KeycloakService,
    private util: Util
  ) {
  }

  ngOnInit() {
    this.cartSubscription = this.cart.observableTickets
    .subscribe(data => {
      this.orderCount = data.length;
    });
  }

  getUser(success) {
    this.storage.get('user')
    .then(user =>  {
      
      if (user !== null) {
        if (user.preferred_username === 'guest') {
          this.guest = true;
        } else {
          
          this.guest = false;
        }
      } else {
        this.guest = true;
      }
      if(success !== null) {
        success();
      }
      
    });
  }


  async loginModal() {
    const modal = await this.modalController.create({
      component: LoginSignupComponent,
      componentProps: {type: 'modal'}
    });

    modal.present();
    modal.onDidDismiss()
    .then(data => {
      if(data.data) {
        this.navController.navigateForward('/profile');
      } else {
        console.log(this.router.url);
        this.setcurrentRoute(this.router.url);
      }
    });
}

  goTo(url) {

    if (url === '/profile') {
      this.getUser(()=>{
        if (this.guest) {
          this.loginModal();
        } else {
          this.navController.navigateForward('/profile');
        }
      });
    } else {
      this.navController.navigateForward(url);
    }
  }

  setcurrentRoute(url) {
    if(this.ionSegment !== null) {
      this.ionSegment.value = url;
    }
  }

  emitFilterClick() {
    this.filter.emit({});
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

}
