import { OAuthService } from 'angular-oauth2-oidc';
import { Store , Product } from 'src/app/api/models';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { QueryResourceService, CommandResourceService } from '../api/services';
import { KeycloakService } from './security/keycloak.service';

export class Favourite {
    route: string;
    type: string;
    data: any;
}
@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  username;

  favouriteDisabled = false;

  private customerId;

  private productsId = [];

  private storesId = [];

  private favourites: Favourite[] = [];


  private favouriteSubject: BehaviorSubject<Favourite[]> = new BehaviorSubject(this.favourites);

  constructor(
    private storage: Storage,
    private oauthService: OAuthService,
    private logger: NGXLogger,
    private queryResource: QueryResourceService,
    private commandResource: CommandResourceService,
    private keycloakService: KeycloakService
  ) {
    this.logger.info('Favourite Service Created');

    this.keycloakService.getUserChangedSubscription()
      .subscribe(user => {
        this.favourites = [];
        this.favouriteSubject.next(this.favourites);
        this.storage.get('customer')
        .then(data => {
          if (data !== null) {
            this.customerId = data.id;
            if (user !== null) {
              if (user.preferred_username === 'guest') {
                this.username = '';
                this.favouriteDisabled = true;
              } else if(user.preferred_username !== undefined) {
                this.username = user.preferred_username;
                this.favouriteDisabled = false;
                this.retrieveStoresFav(0);
                this.retrieveProductFav(0);
              }
            }
        }});
      });
  }

  retrieveProductFav(i) {
    this.logger.info('Getting Favourite Products');
    this.queryResource.findFavouriteProductsByCustomerReferenceUsingGET(
      {
        reference: this.username,
        page: i,
      }
    )
    .subscribe(data => {
      this.logger.info('Got Favotite Product Page ' , i , data.content);
      if(i < data.totalPages) {
        i++;
        data.content.forEach(fs => {
          this.queryResource.findProductUsingGET(fs.productId)
          .subscribe(product => {
            this.favourites.push({data: product , route: '' , type: 'product'});
            this.favouriteSubject.next(this.favourites);
          });
        });
      }
    });
  }

  retrieveStoresFav(i) {
    this.logger.info('Getting Favourite Stores');
    this.queryResource.findFavouriteStoresByCustomerReferenceUsingGET(
      {
        reference: this.username,
        page: i
      }
    )
    .subscribe(data => {
        this.logger.info('Got Favotite Store Page ' , i , data.content);
        if (i < data.totalPages) {
          i++;
          data.content.forEach(fs => {
            this.queryResource.findStoreByIdUsingGET(fs.storeId)
            .subscribe(store => {
              if(store !== null)
              this.favourites.push({data: store , route:  '/store/' + store.regNo , type: 'store'});
              this.favouriteSubject.next(this.favourites);
            });
          });
          this.retrieveStoresFav(i);
        }
    });
  }

  refresh(reset) {
    if (reset === false) {
      this.favouriteSubject.next(this.favourites);
      this.storage.set(this.username +  '_favourites' , this.favourites);
    } else {
      // Get From Server
    }
  }

  addToFavouriteProduct(product: Product , route) {
    this.logger.info('Adding to favourites' , product.id , this.customerId);
    this.commandResource.createFavouriteProductUsingPOST({
      productId: product.id,
      customerId: this.customerId
    })
    .subscribe(fav => {
      this.favourites.push({data: product , route , type: 'product'});
      this.refresh(false);
    });
  }

  addToFavouriteStore(store: Store , route) {
    this.logger.info('Adding to favourites' , store.id , this.customerId);
    this.commandResource.createFavouriteStoreUsingPOST({
      storeId: store.id,
      customerId: this.customerId
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
        });
        break;

        case 'store':
        this.commandResource.deleteFavouriteStoreUsingDELETE(data.id)
        .subscribe(() => {
          const tmpArray = this.favourites.filter(favourite => !(favourite.data.id === data.id
            && favourite.type === type));
          this.favourites = tmpArray;
          this.refresh(false);
        });
        break;

        default: this.logger.warn('Unknown Type Error');
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
}
