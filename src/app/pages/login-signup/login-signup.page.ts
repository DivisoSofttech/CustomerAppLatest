import { NGXLogger } from 'ngx-logger';

import { KeycloakService } from './../../services/security/keycloak.service';
import { IonSlides, MenuController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { CommandResourceService } from 'src/app/api/services';
import { Util } from 'src/app/services/util';
import { ApiConfiguration } from 'src/app/api/api-configuration';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login-signup-page',
  templateUrl: './login-signup.page.html',
  styleUrls: ['./login-signup.page.scss']
})
export class LoginSignupPage implements OnInit {

  constructor(){}
  
  ngOnInit() {}
}
