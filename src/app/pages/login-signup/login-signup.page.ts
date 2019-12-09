
import { Component, OnInit} from '@angular/core';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { LogService } from 'src/app/services/log.service';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-login-signup-page',
  templateUrl: './login-signup.page.html',
  styleUrls: ['./login-signup.page.scss']
})
export class LoginSignupPage implements OnInit {

  constructor(
    private keycloakService: KeycloakService,
    private logger: LogService,
    private util: Util
  ){}
  
  ngOnInit() {}

  
  ionViewDidEnter() {
    this.logger.info(this,'Checking if Guest');
    this.isLoggedIn();
  }

  isLoggedIn() {
    this.keycloakService.isUserLoggedIn()
    .then(notGuest => {
      if(notGuest) {
        this.util.navigateRoot();
      };
    })
      
  }
}
