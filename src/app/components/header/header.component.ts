import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { IonInfiniteScroll, IonSearchbar, ModalController, Platform } from '@ionic/angular';
import { Store } from './../../api/models/store';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { RecentService, RecentType } from 'src/app/services/recent.service';
import { LogService } from 'src/app/services/log.service';
import { HeaderSuggestion, CustomerDTO } from 'src/app/api/models';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  storeSearchResults: Store[] = [];

  showSearchBar = false;

  showSearchPane = false;

  showLoading = false;

  searchTerm = '';

  pageCount = 0;

  loader: HTMLIonLoadingElement;

  customer: CustomerDTO;

  recentSearches: any[] = [];

  suggestions: HeaderSuggestion[] = [];

  @Output() searchEvent: EventEmitter<any> = new EventEmitter();
  notificationCount = 0;
  @Input() notificationsOn = false;

  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;
  @ViewChild('search', null) restaurantSearch: IonSearchbar;

  backButtonSubscription: any;
  headerSuggestion: HeaderSuggestion;

  constructor(
    private queryResource: QueryResourceService,
    private recentService: RecentService,
    private notificationService: NotificationService,
    private logger: LogService,
    private sharedData: SharedDataService,
    private modalController: ModalController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.logger.info(this, 'Initializing', HeaderComponent.name);
    this.getNotificationCount();
    this.getRecents();
    this.nativeBackButtonHandler();
    this.fetchCustomer();
  }

  ngOnDestroy(): void {
    this.backButtonSubscription ? this.backButtonSubscription.unsubscribe() : null;
  }

  private nativeBackButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      if (this.showSearchBar && this.showSearchPane) {
        this.showSearchBar = false;
        this.showSearchPane = false;
      }
    });
  }

  private getRecents() {
    this.recentService.getRecentRestaurantSearchTerms()
      .subscribe(data => {
        if (data !== null) {
          this.recentSearches = data;
        }
      })
  }

  private fetchCustomer() {
    this.sharedData.getData('user')
      .then(user => {
        if (user) {
          this.queryResource.findCustomerByIdpCodeUsingGET(user.preferred_username)
            .subscribe(customer => {
              this.customer = customer;
            });
        } else {
          this.fetchCustomer();
        }
      });
  }

  private getNotificationCount() {
    this.notificationService.notificationBehaviouralSubject
      .subscribe(count => {
        this.notificationCount = count;
      });
  }

  toggleSearchBar() {
    this.logger.info(this, 'SearchBar Toggled - View', this.showSearchBar);
    this.showSearchBar = !this.showSearchBar;
    this.showSearchPane = !this.showSearchPane;
    if (this.showSearchBar === true) {
      this.restaurantSearch.setFocus();
      this.searchEvent.emit(true);
    } else {
      this.storeSearchResults = [];
      this.searchTerm = '';
      this.searchEvent.emit(false);
    }
  }

  toggleInfiniteScroll() {
    this.logger.info(this, 'InfiniteScroll Toggled ', this.infiniteScroll.disabled);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }


  public fetchSuggestions() {
    this.queryResource.getSuggestionUsingGET(this.searchTerm)
      .subscribe((data: HeaderSuggestion[]) => {
        this.suggestions = data;
        console.error(data);
      })
  }

  public selectSearchTerm(headerSuggestion: HeaderSuggestion) {
    this.headerSuggestion = headerSuggestion;
    this.search();
  }

  private search() {
    this.fetchSearchResults(0);
  }

  fetchSearchResults(i) {
    console.error(this.headerSuggestion);
    const found = this.recentSearches.some(el => el.data === this.searchTerm);
    if (!found) {
      this.recentService.saveRecent({ data: this.searchTerm, type: RecentType.STORE });
    }
    this.queryResource.getHeaderResultUsingGET({
      suggestionData: this.headerSuggestion.suggestionData,
      indexName: this.headerSuggestion.indexName,
      page: i

    }).subscribe(data => {
      console.error(data);
    })
  }



  loadMoreData(event) {
    this.logger.info(this, 'Loading More Data');
    ++this.pageCount;
    this.fetchSearchResults(this.pageCount);
  }

  async showNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      componentProps: { type: 'full' }
    });
    modal.present();
  }
}
