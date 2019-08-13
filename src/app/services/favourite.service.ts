import { OAuthService } from 'angular-oauth2-oidc';
import { Store , Product } from 'src/app/api/models';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

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

  private productsId = [];
  private storesId = [];

  private favourites: Favourite[] = [];

  private favouriteSubject: BehaviorSubject<Favourite[]> = new BehaviorSubject(this.favourites);

  constructor(
    private storage: Storage,
    private oauthService: OAuthService
  ) {
    console.log('Favourite Service Created');
    this.oauthService.loadUserProfile()
    .then((data: any) => {
      this.username = data.preferred_username;
      this.storage.get(this.username +  '_favourites')
      .then(p => {
        console.log(p);
        if (p != undefined) {
          console.log(p);
          this.favourites = p;
        }
        if (p === null) {this.storage.set(this.username +  '_favourites' , this.favourites); }
        this.favouriteSubject.next(p);
      })
      .catch(err => {
        this.storage.set(this.username +  '_favourites' , this.favourites);
      });
    });
  }

  refresh() {
    this.favouriteSubject.next(this.favourites);
    this.storage.set(this.username +  '_favourites' , this.favourites);
  }

  addToFavouriteProduct(product: Product , route) {
    this.favourites.push({data: product , route , type: 'product'});
    this.refresh();
  }

  addToFavouriteStore(store: Store , route) {
    this.favourites.push({data: store , route , type: 'store'});
    this.refresh();
  }

  removeFromFavorite(data , type) {
    const tmpArray = this.favourites.filter(favourite => !(favourite.data.id === data.id
      && favourite.type === type));
    console.log('Temp Array is' , tmpArray);
    this.favourites = tmpArray;
    this.refresh();
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
    console.log(this.favourites);
    for (const fav of this.favourites) {
      if (fav.type === 'store') {
      idArray.push(fav.data.id);
      }
    }

    return idArray;
  }
}
