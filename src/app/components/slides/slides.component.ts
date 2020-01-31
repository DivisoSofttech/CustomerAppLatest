import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements OnInit {

  slideOpts = {
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }
  constructor(
    private sharedData: SharedDataService,
    private navController: NavController
  ) { }

  ngOnInit() {}

  skipSlide() {
    this.sharedData.saveToStorage('isFirstTime',false);
    this.navController.navigateRoot('/restaurant');
  }

}
