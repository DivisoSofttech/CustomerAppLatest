import { NotificationComponent } from 'src/app/components/notification/notification.component';
import {
  IonInfiniteScroll,
  IonSearchbar,
  ModalController
} from '@ionic/angular';
import { Store } from './../../api/models/store';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { LocationService } from './../../services/location-service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Util } from 'src/app/services/util';
import { NGXLogger } from 'ngx-logger';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  storeSearchResults: Store[] = [];

  showSearchBar = false;

  showSearchPane = false;

  showLoading = false;

  searchTerm = '';

  pageCount = 0;

  loader: HTMLIonLoadingElement;

  customer;

  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;
  @ViewChild('restaurantSearch', null) restaurantSearch: IonSearchbar;
  keycloakSubscription: any;
  notificationsOn = false;
  notificationCount = 0;

  constructor(
    private queryResource: QueryResourceService,
    private logger: NGXLogger,
    private modalController: ModalController,
    private notificationService: NotificationService,
    private keycloakService: KeycloakService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.logger.info('Initializing', HeaderComponent.name);
    this.getNotificationCount();
    this.checkUser();
  }

  checkUser() {
    this.keycloakSubscription = this.keycloakService.getUserChangedSubscription()
    .subscribe((data: any) => {
      this.logger.info('Checking If guest : HeaderComponet');
      if (data !== null) {
        if (data.preferred_username === 'guest') {
          this.notificationsOn = false;
        } else {
          this.getUserProfile();
          this.notificationsOn = true;
        }
      } else {
        this.notificationsOn = false;
      }
    });
  }

  getUserProfile() {
    this.storage.get('user')
    .then(user => {
      this.queryResource.findCustomerByReferenceUsingGET(user.preferred_username)
      .subscribe(customer => {
        this.customer = customer;
      });
    });
  }

  getNotificationCount() {
    this.notificationService.notificationBehaviouralSubject
      .subscribe(count => {
        this.notificationCount = count;
      });
  }

  toggleSearchBar() {
    this.logger.info('SearchBar Toggled - View', this.showSearchBar);
    this.showSearchBar = !this.showSearchBar;
    this.showSearchPane = !this.showSearchPane;
    if (this.showSearchBar === true) {
      this.restaurantSearch.setFocus();
    }
  }

  toggleInfiniteScroll() {
    this.logger.info('InfiniteScroll Toggled ', this.infiniteScroll.disabled);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }



  // Get Current Location

  getSearchResults(i) {
    this.queryResource
      .headerUsingGET({
        searchTerm: this.searchTerm,
        page: 0
      })
      .subscribe(
        result => {
          this.showLoading = false;
          if (result.content.length === 0) {
            return;
          } else {
            ++i;
            if (result.totalPages === i) {
              this.toggleInfiniteScroll();
            }
            result.content.forEach(s => {
              this.storeSearchResults.push(s);
            });
          }
        },
        err => {
          this.showLoading = false;
        }
      );
  }

  search(event) {
    this.showLoading = true;
    this.logger.info('Getting Restaurants By Name');
    this.searchTerm = event.detail.value;
    this.storeSearchResults = [];
    if(this.searchTerm !=='') {
      this.getSearchResults(0);
    } else {
      this.showLoading = false;
    }
  }

  loadMoreData(event) {
    this.logger.info('Loading More Data');
    this.pageCount++;
    this.getSearchResults(this.pageCount);
  }

  async showNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      componentProps: { type: 'full' }
    });
    modal.present();
  }
}
