import { BannerDTO } from './../../api/models/banner-dto';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { IonSlides, Platform } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  slideOpts = {
    slidesPerView: this.platform.width() >= 640 ? 3 : 2,
    loop: true,
    autoplay: true
  };

  @ViewChild('slides', null) slides: IonSlides;

  banners: BannerDTO[] = [];

  constructor(
    private platform: Platform,
    private queryResource: QueryResourceService
  ) {}

  ngOnInit() {
    this.getBanners();
  }

  ionViewWillLeave() {
    this.slides.stopAutoplay();
  }
  ionViewDideave() {
    this.slides.stopAutoplay();
  }

  ionViewDidEnter() {
    this.slides.startAutoplay();
  }

  getBanners() {
    this.queryResource.findStoreBannersUsingGET({})
    .subscribe(data => {
      console.log('Banners Got');
      this.banners = data;
      this.slides.startAutoplay();
    },
    err => {
      console.log('Error getting banners');
    });
  }

}
