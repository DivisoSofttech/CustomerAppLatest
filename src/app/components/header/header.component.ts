import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { IonInfiniteScroll,IonSearchbar,ModalController} from '@ionic/angular';
import { Store } from './../../api/models/store';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import {Component,OnInit,ViewChild,OnDestroy} from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Storage } from '@ionic/storage';
import { RecentService, RecentType } from 'src/app/services/recent.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit , OnDestroy {

  storeSearchResults: Store[] = [];

  showSearchBar = false;

  showSearchPane = false;

  showLoading = false;

  searchTerm = '';

  pageCount = 0;

  loader: HTMLIonLoadingElement;

  customer;

  recents:any[] = [];

  searchDebounceTime = 1500;

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
    private storage: Storage,
    private recentService: RecentService
  ) {}

  ngOnInit() {
    this.logger.info('Initializing', HeaderComponent.name);
    this.getNotificationCount();
    this.checkUser();
    this.getRecents();
  }

  ngOnDestroy(): void {
    this.keycloakSubscription.unsubscribe();
  }

  getRecents() {
    this.recentService.getRecentRestaurantSearchTerms()
    .subscribe(data => {
      if(data !== null) {
        this.recents = data;
      }
    })
  }

  textCleared() {
    this.restaurantSearch.debounce = 100;
    this.restaurantSearch.debounce = 1500;
  }

  selectSerachTerm(searchTerm) {
    this.restaurantSearch.debounce = 100;
    this.restaurantSearch.value = searchTerm;
    this.restaurantSearch.debounce = this.searchDebounceTime;
  }

  checkUser() {
    this.keycloakSubscription = this.keycloakService.getUserChangedSubscription()
    .subscribe((data: any) => {
      this.logger.info('Checking If guest : HeaderComponet' , data);
      if (data !== null && data !== undefined ) {
        if (data.preferred_username === 'guest') {
          this.notificationsOn = false;
        } else {
          // this.getUserProfile();
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
    const found = this.recents.some(el => el.data === this.searchTerm);
    if(!found) {
      this.recentService.saveRecent({data:this.searchTerm , type:RecentType.STORE});
    }
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
