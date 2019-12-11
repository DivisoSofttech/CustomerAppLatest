import { NGXLogger } from 'ngx-logger';
import { Util } from './../../services/util';
import { Component, OnInit, Input } from '@angular/core';
import {
  QueryResourceService,
  CommandResourceService
} from 'src/app/api/services';
import {UserRatingReview, UserRatingReviewDTO } from 'src/app/api/models';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { LoginSignupComponent } from '../login-signup/login-signup.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  @Input() store;

  @Input() viewType='normal';

  rateReviews: UserRatingReview[] = [];

  review: UserRatingReviewDTO = {
    rating: 0,
    review: ''
  };

  pageCount = 0;

  showReviewLoading = true;

  customers = [];

  guest = false;

  username = '';

  constructor(
    private queryResource: QueryResourceService,
    private commandResource: CommandResourceService,
    private storage: Storage,
    private util: Util,
    private logger: NGXLogger,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getRatingReview(0);
    this.getUser();
  }

  toggleInfiniteScroll() {}

  async loginModal() {
    const modal = await this.modalController.create({
      component: LoginSignupComponent,
      componentProps: { type: 'modal' }
    });

    await modal.present();
    await modal.onDidDismiss().then(() => {
      this.getUser();
    });
  }

  getUser() {
    this.storage.get('user').then(user => {
      if (user) {
        if (user.preferred_username === 'guest') {
          this.guest = true;
        } else {
          this.guest = false;
          this.username = user.preferred_username;
        }
      } else {
        this.guest = true;
      }
    });
  }

  updateRating(event) {
    this.review.rating = event;
  }


  getRatingReview(i) {
    this.queryResource
      .findUserRatingReviewByRegNoUsingGET({
        regNo: this.store.regNo,
        page: i
      })
      .subscribe(
        result => {
          this.showReviewLoading = false;
          this.logger.info('Got Rating Review', result.content);
          ++i;
          if (result.totalPages === i) {
            this.toggleInfiniteScroll();
          }
          result.content.forEach(rr => {
            this.rateReviews.push(rr);
            // this.queryResource
            //   .findCustomerByReferenceUsingGET(rr.userName)
            //   .subscribe(data => {
            //     this.customers.push(data);
            //   });
          });
        },
        err => {
          this.showReviewLoading = false;
          this.logger.info('Error fetching rating/review data', err);
        }
      );
  }

  postReview() {
    this.util.createLoader().then(loader => {
      loader.present();
      this.storage.get('user').then(usr => {
        this.review.storeId= this.store.id;
        this.review.userName = this.username;
        this.review.date = new Date().toISOString();
        if (this.review.rating > 0) {
          this.logger.info("Saving" , this.review,this.store);
          this.commandResource
            .createUserRatingReviewUsingPOST(this.review)
            .subscribe(
              result => {
                this.logger.info(result);
                this.getRatingReview(0);
                this.rateReviews = [];
                this.review.review = '';
                loader.dismiss();
              },
              err => {
                loader.dismiss();
                this.util.createToast(
                  'Error while posting rating/review. Try again later'
                );
              }
            );
        } else {
          loader.dismiss();
          this.util.createToast('Review and Rating field can\'t be empty.');
        }
      });
    });
  }

  loadMoreData() {
    this.pageCount++;
    this.getRatingReview(this.pageCount);
  }
}
