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
    id:any;
}

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  
  public favouriteDisabled = false;

  private favourites: Favourite[] = [];

  private favouriteStoresId: number[] = [];

  private favouriteProductsId: number[] = [];

  private keycloakUser: KeycloakUser;

  private customer: CustomerDTO;

  private favouriteSubject: BehaviorSubject<Favourite[]> = new BehaviorSubject(this.favourites);

  private favouriteStoresIdSubject: BehaviorSubject<number[]> = new BehaviorSubject(this.favouriteStoresId);

  private favouriteProductsIdSubject: BehaviorSubject<number[]> = new BehaviorSubject(this.favouriteProductsId);

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

  private initFavourite() {
    this.getKeycloakUser();
  }

  private getKeycloakUser() {
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
        data.content.forEach(fs => {
         this.fetchProduct(fs.productId,fs);
        });
      }
      i++;
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
          data.content.forEach(fs => { this.fetchStore(fs.storeId , fs);});
        }
        i++;
    });
  }


  addToFavouriteProduct(product: Product , route) {
    this.logger.info(this,'Adding to favourites' , product.id , this.customer.id);
    this.commandResource.createFavouriteProductUsingPOST({
      productId: product.id,
      customerId: this.customer.id
    })
    .subscribe(fav => {
      this.favourites.push({id: fav.id,data: product , route , type: 'product'});
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
      this.favourites.push({id: fav.id,data: store , route , type: 'store'});
      this.refresh(false);
    });
  }

  removeFromFavorite(data , type) {
    switch (type) {

      case 'product':
        this.commandResource.deleteFavouriteProductUsingDELETE(data.id)
        .subscribe(() => {
          const tmpArray = this.favourites.filter(favourite => !(favourite.id === data.id
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
          const tmpArray = this.favourites.filter(favourite => !(favourite.id === data.id
            && favourite.type === type));
          this.favourites = tmpArray;
          console.error('>>>>',data);
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
    return this.favouriteProductsIdSubject;
  }

  getFavouriteStoresID() {
    return this.favouriteStoresIdSubject;   
  }

  fetchStore(id,s) {
    this.queryResource.findStoreByIdUsingGET(id)
    .subscribe(store => {
      if(store !== null)
      this.favourites.push({id: s.id,data: store , route:  '/store/' + store.regNo , type: 'store'});
      this.refresh(false);
    });
  }

  fetchProduct(id,s) {
    this.queryResource.findProductUsingGET(id)
    .subscribe(product => {
      this.favourites.push({id: s.id ,data: product , route: '' , type: 'product'});
      this.refresh(false);
    });
  }

  setFavouriteIds() {
    const productIdArray = [],storeIdArray = [];
    this.favourites.forEach(fav=> {
      if(fav.type==='product') {
        productIdArray.push(fav.data.id);
      } else{
        storeIdArray.push(fav.data.id);
      }
    });
    this.favouriteProductsIdSubject.next(productIdArray);
    this.favouriteStoresIdSubject.next(storeIdArray);
  }

  refresh(reset) {
    if (reset === false) {
      this.setFavouriteIds();
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
