import { Util } from './../../services/util';
import { RatingReview } from './../../api/models/rating-review';
import { Component, OnInit, Input } from '@angular/core';
import { QueryResourceService, CommandResourceService } from 'src/app/api/services';
import { UserRatingDTO, ReviewDTO } from 'src/app/api/models';
import { Storage } from '@ionic/storage';
import { KeycloakService } from 'src/app/services/security/keycloak.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {

  @Input() store;

  rateReviews: RatingReview[] = [];

  rate: UserRatingDTO = { rating: 1 };

  review: ReviewDTO = {
    userName: '',
    review: '',
    reviewedDate: '',
    storeId: 0
  };

  pageCount = 0;

  showReviewLoading = true;

  customers = [];

  guest = false;

  constructor(
    private queryResource: QueryResourceService,
    private commandResource: CommandResourceService,
    private storage: Storage,
    private util: Util,
    private keycloak: KeycloakService
  ) { }

  ngOnInit() {
    this.getRatingReview(0);
    this.getUser();
  }

  toggleInfiniteScroll() {

  }

  getUser() {
    this.keycloak.getUserChangedSubscription()
    .subscribe(user => {
      if(user !== null) {
        if (user.preferred_username === 'guest') {
          this.guest = true;
        } else {
          this.guest = false;
        }
      } else {
        this.guest = true;
      }
    });
  }

  updateRating(event) {
    this.rate.rating = event;
    console.log(this.rate.rating);
  }

  getRatingReview(i) {
    this.queryResource
    .findRatingReviewByStoreidAndCustomerNameUsingGET({
      storeId: this.store.regNo,
      page: i
    })
    .subscribe(
      result => {
        this.showReviewLoading = false;
        console.log('Got rating' , result.content);
        ++i;
        if (result.totalPages === i) {
          this.toggleInfiniteScroll();
        }
        result.content.forEach(rr => {
          this.rateReviews.push(rr);
          this.queryResource.findCustomerByReferenceUsingGET(rr.review.userName)
          .subscribe(data => {
            this.customers.push(data);
          })
        });
      },
      err => {
        this.showReviewLoading = false;
        console.log('Error fetching review data', err);
      }
    );
  }

  postReview() {
    this.storage.get('user')
    .then(usr => {
      this.review.storeId = this.store.id;
      this.rate.storeId = this.store.id;
      if (this.review.review !== '') {
        const raterev: RatingReview = { review: this.review, rating: this.rate };
        raterev.rating.userName = usr.preferred_username;
        raterev.review.userName = usr.preferred_username;
        this.commandResource
          .createRatingAndReviewUsingPOST({ ratingReview: raterev })
          .subscribe(
            result => {
              console.log(result);
              this.getRatingReview(0);
              this.rateReviews = [];
              this.review.review = '';
            },
            err => {
              this.util.createToast('Error while posting review. Try again later');
            }
          );
      } else {
        this.util.createToast('Review field can\'t be empty.');
      }
    });
  }

  loadMoreData() {
    this.pageCount++;
    this.getRatingReview(this.pageCount);
  }

}
