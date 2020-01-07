import { Store , Product, CustomerDTO } from 'src/app/api/models';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryResourceService, CommandResourceService } from '../api/services';
import { LogService } from './log.service';
import { KeycloakUser } from '../models/keycloak-user';
import { SharedDataService } from './shared-data.service';
import { KeycloakService } from './security/keycloak.service';

const FAVOURITE_KEY = 'favourite';
export interface Favourite {
    route: string;
    type: string;
    data: any;
}

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  
  favouriteDisabled = false;

  private favourites: Favourite[] = [];

  private keycloakUser: KeycloakUser;

  private customer: CustomerDTO;

  private favouriteSubject: BehaviorSubject<Favourite[]> = new BehaviorSubject(this.favourites);

  constructor(
    private keycloakService: KeycloakService,
    private sharedData: SharedDataService,
    private logger: LogService,
    private queryResource: QueryResourceService,
    private commandResource: CommandResourceService,
  ) {
    this.logger.info(this,'Favourite Service Created');
    this.initFavourite();
  }

  initFavourite() {
    this.getKeycloakUser();
  }

  getKeycloakUser() {
    this.keycloakService.getUserChangedSubscription()
    .subscribe(user => {
     if(user) {
      this.keycloakUser = user;
      this.getCustomer();
      this.fetchFavouriteProducts(0);
      this.fetchFavouriteStores(0); 
     }
    });
  }

  getCustomer() {
    this.queryResource.findCustomerByIdpCodeUsingGET(this.keycloakUser.preferred_username)
    .subscribe(customer => {
      this.customer = customer;
    })
  }

  getFavouriteDetailsFromSTorage() {
    this.sharedData.getData(FAVOURITE_KEY)
    .then((favs: Favourite[])=> {
      if(favs) {
        this.favouriteSubject.next(favs);
      } else {
        this.fetchFavouriteProducts(0);
        this.fetchFavouriteStores(0);
      }
    })
  }

  fetchFavouriteProducts(i) {
    this.logger.info(this,'Getting Favourite Products');
    this.queryResource.findFavouriteProductsByCustomerIdpCodeUsingGET(
      {
        idpCode: this.keycloakUser.preferred_username,
        page: i,
      }
    )
    .subscribe(data => {
      this.logger.info(this,'Got Favotite Product Page ' , i , data.content);
      if(i < data.totalPages) {
        i++;
        data.content.forEach(fs => {
         this.fetchProduct(fs.productId);
        });
      }
    });
  }


  fetchFavouriteStores(i) {
    this.logger.info(this,'Getting Favourite Stores');
    this.queryResource.findFavouriteStoresByCustomerIdpCodeUsingGET(
      {
        idpCode: this.keycloakUser.preferred_username,
        page: i
      }
    )
    .subscribe(data => {
        this.logger.info(this,'Got Favotite Store Page ' , i , data.content);
        if (i < data.totalPages) {
          i++;
          data.content.forEach(fs => { this.fetchStore(fs.storeId);});
        }
    });
  }


  addToFavouriteProduct(product: Product , route) {
    this.logger.info(this,'Adding to favourites' , product.id , this.customer.id);
    this.commandResource.createFavouriteProductUsingPOST({
      productId: product.id,
      customerId: this.customer.id
    })
    .subscribe(fav => {
      this.favourites.push({data: product , route , type: 'product'});
      this.refresh(false);
    });
  }

  addToFavouriteStore(store: Store , route) {
    this.logger.info(this,'Adding to favourites' , store,this.customer);
    this.commandResource.createFavouriteStoreUsingPOST({
      storeId: store.id,
      customerId: this.customer.id
    })
    .subscribe(fav => {
      this.favourites.push({data: store , route , type: 'store'});
      this.refresh(false);
    });
  }

  removeFromFavorite(data , type) {
    switch (type) {

      case 'product':
        this.commandResource.deleteFavouriteProductUsingDELETE(data.id)
        .subscribe(() => {
          const tmpArray = this.favourites.filter(favourite => !(favourite.data.id === data.id
            && favourite.type === type));
          this.favourites = tmpArray;
          this.refresh(false);
        },
        err=>{
          this.refresh(true);
        });
        break;

        case 'store':
        this.commandResource.deleteFavouriteStoreUsingDELETE(data.id)
        .subscribe(() => {
          const tmpArray = this.favourites.filter(favourite => !(favourite.data.id === data.id
            && favourite.type === type));
          this.favourites = tmpArray;
          this.refresh(false);
        },
        err=>{
          this.refresh(true);
        });
        break;

        default: this.logger.warn(this,'Unknown Type Error');
    }
  }


  getFavourites(): BehaviorSubject<Favourite[]> {
    return this.favouriteSubject;
  }


  getFavouriteProductsID() {
    const idArray = [];
    for (const fav of this.favourites) {
      if (fav.type === 'product') {
      idArray.push(fav.data.id);
      }
    }
    return idArray;
  }

  getFavouriteStoresID() {
    const idArray = [];
    for (const fav of this.favourites) {
      if (fav.type === 'store') {
      idArray.push(fav.data.id);
      }
    }
    return idArray;
  }

  fetchStore(id) {
    this.queryResource.findStoreByIdUsingGET(id)
    .subscribe(store => {
      if(store !== null)
      this.favourites.push({data: store , route:  '/store/' + store.regNo , type: 'store'});
      this.favouriteSubject.next(this.favourites);
    });
  }

  fetchProduct(id) {
    this.queryResource.findProductUsingGET(id)
    .subscribe(product => {
      this.favourites.push({data: product , route: '' , type: 'product'});
      this.favouriteSubject.next(this.favourites);
    });
  }

  refresh(reset) {
    if (reset === false) {
      this.logger.info(this,'Updating Refresh Array');
      this.favouriteSubject.next(this.favourites);
      this.sharedData.saveToStorage(FAVOURITE_KEY, this.favourites);
    } else {
      this.logger.info(this,'Deleting Data From Storage and Refreshing');
      this.sharedData.deleteData(FAVOURITE_KEY);
      this.favourites = [];
      this.favouriteSubject.next(this.favourites);
      this.fetchFavouriteStores(0);
      this.fetchFavouriteProducts(0);
    }
  }

}
