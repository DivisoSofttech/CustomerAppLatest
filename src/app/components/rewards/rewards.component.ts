import { KeycloakService } from './../../services/security/keycloak.service';
import { Component, OnInit } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
})
export class RewardsComponent implements OnInit {

  constructor(private keycloakService: KeycloakService,
              private queryService: QueryResourceService) { }

  rewards;

  ngOnInit() {
    this.keycloakService.getUserChangedSubscription()
    .subscribe(user => {
     if (user) {
      this.queryService.findLoyaltyPointByIdpCodeUsingGET(user.preferred_username)
        .subscribe(reward => {
          console.log('Reward for the user '+ user.preferred_username+ ' rewards '+ reward);
          this.rewards = reward;
        });
     }
  });

}

}
