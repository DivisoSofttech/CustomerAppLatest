import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { IonInfiniteScroll, IonSearchbar, ModalController, Platform, NavController } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { RecentService, RecentType } from 'src/app/services/recent.service';
import { LogService } from 'src/app/services/log.service';
import { HeaderSuggestion, CustomerDTO, HeaderResult } from 'src/app/api/models';
import { KeycloakService } from 'src/app/services/security/keycloak.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() public isGuest = false;
  @Output() public searchEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild(IonInfiniteScroll, null) private infiniteScroll: IonInfiniteScroll;
  @ViewChild('search', null) private restaurantSearch: IonSearchbar;


  public searchTerm = '';

  public customer: CustomerDTO;

  public suggestions: HeaderSuggestion[] = [];

  private tempSuggestions: HeaderSuggestion[] = [];

  public totalResultsFound  = 0;

  public results: HeaderResult[] = [];
  
  private headerSuggestion: HeaderSuggestion;

  public recentSearches: any[] = [];


  public showSearchBar = false;
  public showSearchPane = false;
  public showLoading = false;
  public showNotFound = false;

  private pageCount = 0;

  public notificationCount = 0;

  private backButtonSubscription: any;
  private notificationSubscription: any;
  private recentSubscription: any;
  private onChangeSubscription: any;

  constructor(
    private recentService: RecentService,
    private notificationService: NotificationService,
    private keycloakService: KeycloakService,
    private logger: LogService,
    private queryResource: QueryResourceService,
    private modalController: ModalController,
    private platform: Platform,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.toggleInfiniteScroll(true);
    this.logger.info(this, 'Initializing', HeaderComponent.name);
    this.onChangeSubscription = this.restaurantSearch.ionChange.subscribe((data)=>{
      if(data.detail.value.trim() !== '') {
        this.suggestions = [];
        this.fetchSuggestions();  
      }
    });
    this.getNotificationCount();
    this.getRecents();
    this.nativeBackButtonHandler();
    this.fetchCustomer();
  }

  private getNotificationCount() {
    this.notificationSubscription = this.notificationService.notificationBehaviouralSubject
      .subscribe(count => {
        this.notificationCount = count;
      });
  }

  private getRecents() {
    this.recentSubscription = this.recentService.getRecentRestaurantSearchTerms()
      .subscribe(data => {
        if (data !== null) {
          this.recentSearches = data;
        }
      })
  }

  private nativeBackButtonHandler() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      if (this.showSearchBar && this.showSearchPane) {
        this.showSearchBar = false;
        this.showSearchPane = false;
      }
    });
  }

  private fetchCustomer() {
    this.keycloakService.getUserChangedSubscription()
      .subscribe(user => {
        if (user) {
          this.queryResource.findCustomerByIdpCodeUsingGET(user.preferred_username)
            .subscribe(customer => {
              this.customer = customer;
            });
        }
      });
  }
  public fetchSuggestions() {
    this.toggleInfiniteScroll(true);
    this.results = [];
    this.showLoading = true;
    this.queryResource.getSuggestionUsingGET(this.searchTerm)
      .subscribe((data: HeaderSuggestion[]) => {
        this.showLoading = false;
        this.showNotFound = true;
        this.suggestions = data;
      }, err => {
        this.showLoading = false;
        this.showNotFound = false;
      });
  }

  public selectSuggestionSearchTerm(headerSuggestion: HeaderSuggestion) {
    this.onChangeSubscription.unsubscribe();
    this.showLoading = true;
    this.headerSuggestion = headerSuggestion;
    this.tempSuggestions = this.suggestions;
    this.suggestions = [];
    this.showNotFound = false;
    this.searchTerm = headerSuggestion.suggestionData;
    this.toggleInfiniteScroll(false);
    setTimeout(()=>{
      this.onChangeSubscription = this.restaurantSearch.ionChange.subscribe(() => {
        this.suggestions = [];
        this.fetchSuggestions();
      });
    },3000)
    this.search();
  }

  private search() {
    this.fetchSearchResults(0);
  }

  private fetchSearchResults(i , event?) {
    this.queryResource.getHeaderResultUsingGET({
      suggestionData: this.headerSuggestion.suggestionData,
      indexName: this.headerSuggestion.indexName,
      page: i

    }).subscribe(data => {
      this.totalResultsFound = data.totalElements;
      this.showLoading = false;
      data.content.forEach(result => {
        this.results.push(result);
      });
      if(event) event.target.complete();
      if(data.totalPages===i) {
        this.toggleInfiniteScroll(true);
      }
    })
  }

  fetchResult(result: HeaderResult) {
    this.queryResource.searchUsingGET(
      {
        indexName: result.resultType,
        id: result.id
      }
    ).subscribe((data: any) => {
      if (result.resultType === 'product') {
        this.navController.navigateForward('/store/search/' + data.idpcode + '/p/' + data.id + '/' + data.category.id);
      } else if (result.resultType === 'category') {
        this.navController.navigateForward('/store/search/' + data.idpcode + '/c/' + data.id);
      } else {

      }
    });
  }


  toggleSearchBar() {
    this.logger.info(this, 'SearchBar Toggled - View', this.showSearchBar);
    this.showSearchBar = !this.showSearchBar;
    this.showSearchPane = !this.showSearchPane;
    this.showLoading = false;
    if (this.showSearchBar === true) {
      this.restaurantSearch.setFocus();
      this.searchEvent.emit(true);
      this.toggleInfiniteScroll(false);
    } else {
      this.results = [];
      this.searchTerm = '';
      this.headerSuggestion = undefined;
      this.showNotFound = false;
      this.searchEvent.emit(false);
      this.toggleInfiniteScroll(true);
    }
  }

  toggleInfiniteScroll(value) {
    this.logger.info(this, 'InfiniteScroll Toggled ', this.infiniteScroll.disabled);
    this.infiniteScroll.disabled = value;
  }

  loadMoreData(event) {
    this.logger.info(this, 'Loading More Data');
    ++this.pageCount;
    this.fetchSearchResults(this.pageCount,event);
  }

  textClear() {
    this.suggestions = [];
    this.results = [];
    this.restaurantSearch.debounce = 100;
    this.restaurantSearch.debounce = 1500;
  }
  async showNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      componentProps: { type: 'full' }
    });
    modal.present();
  }

  private unsubscribeAll() {
    this.backButtonSubscription ? this.backButtonSubscription.unsubscribe() : null;
    this.recentSubscription ? this.recentSubscription.unsubscribe() : null;
    this.notificationSubscription ? this.notificationSubscription.unsubscribe() : null;
    this.onChangeSubscription ? this.onChangeSubscription.unsubscribe() : null;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

}
