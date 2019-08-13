import { FavouriteService , Favourite} from './../../services/favourite.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-favourite-list',
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.scss'],
})
export class FavouriteListComponent implements OnInit {

  favourites: Favourite[] = [];

  constructor(
    private favourite: FavouriteService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getFavourites();
  }

  getFavourites() {
    this.favourite.getFavourites()
    .subscribe(fav => {
      this.favourites = fav;
    });
  }

  route(favourite: Favourite) {
    const routeURL = favourite.route + '#' + favourite.data.id;
    this.navController.navigateForward(routeURL);
  }

  removeFromFavourite(product) {
    this.favourite.removeFromFavorite(product.data, product.type);
    this.getFavourites();
  }


}
