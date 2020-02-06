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
      if(fav !== undefined && fav !== null) {
        this.favourites = fav.reverse();
      }
    });
  }

  route(favourite: Favourite) {
    const routeURL = favourite.route + '#' + favourite.data.id;
    this.navController.navigateForward(routeURL);
  }

  removeFromFavourite(fav) {
    this.favourite.removeFromFavorite(fav, fav.type);
    this.getFavourites();
  }


}
