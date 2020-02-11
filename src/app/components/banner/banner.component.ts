import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { IonSlides, Platform } from '@ionic/angular';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Banner } from 'src/app/api/models';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit , OnDestroy {

  showLoading: Boolean = true;
  @Input() direction: string;
  @ViewChild('slides', {static: false}) slides: IonSlides;
  banners: Banner[] = [];
  bannerSubscription: any;

  slideOpts = {
    direction: this.direction,
    preloadImages: true,
    lazy: false,
    slidesPerView: this.platform.width() < 1280 ? 1 : 2,
    on: {
      beforeInit() {
        const swiper = this;

        swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const {
          width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;
        }
      },
      setTransition(duration) {
        const swiper = this;
        swiper.slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
      }
    }
  };

  constructor(
    private platform: Platform,
    private queryResource: QueryResourceService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.slideOpts.direction = this.direction;
    this.getBanners(0);
    if (this.slides) {
    this.slides.startAutoplay();
    }
  }

  ngOnDestroy() {
    this.bannerSubscription.unsubscribe();
  }


  getBanners(i) {
    this.bannerSubscription = this.queryResource.findPremiumBannersUsingGET({
      page: i
    }).subscribe(
      data => {
        data.content.forEach(b => {
          this.banners.push(b);
        });
        ++i;
        if (i < data.totalPages) {
          this.getBanners(i);
        } else {
          this.showLoading = false;
        }
      },
      err => {
        this.showLoading = false;
        this.logger.error('Error Getting Banners', err);
      }
    );
    this.showLoading = false;
    }

    refresh() {
      this.bannerSubscription.unsubscribe();
      this.banners = [];
      this.ngOnInit();
    }
}
