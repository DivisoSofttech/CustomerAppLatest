import { NGXLogger } from 'ngx-logger';
import { Component, OnInit, Input } from '@angular/core';
import { QueryResourceService } from 'src/app/api/services';
import { PopoverController} from '@ionic/angular';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-hotel-menu-popover',
  templateUrl: './hotel-menu-popover.component.html',
  styleUrls: ['./hotel-menu-popover.component.scss']
})
export class HotelMenuPopoverComponent implements OnInit {

  @Input() categories = [];
  @Input() storeId;
  @Input() selectedCategory;

  products = [];

  constructor(
    private popoverController: PopoverController,
    private queryResourceService: QueryResourceService,
    private logger: NGXLogger,
    private util: Util
  ) {}

  ngOnInit() {
  }

  selectCategory(category) {

    this.util.createLoader()
    .then(loader => {
      loader.present();
      this.selectedCategory = category.key;
      this.getProducts(0 , loader);
    });

  }

  getProducts(i , loader) {

    // Change this API Later to findStockCurrentByStoreIdAndCategoryName()
    this.queryResourceService.findStockCurrentByCategoryNameAndStoreIdUsingGET({
      storeId: this.storeId,
      categoryName: this.selectedCategory
    })
      .subscribe(data => {
        loader.dismiss();
        this.logger.info('Category ' , this.selectedCategory , ' Produts ' , data);
        data.content.forEach(p => {
          this.products.push(p);
        });
        ++i;
        if (i < data.totalPages) {
          this.getProducts(i, loader);
        } else {
          this.popoverController.dismiss({
            selectedCategory: this.selectedCategory,
            result: this.products
          });
        }
      },
      err => {
        loader.dismiss();
      });
  }

  dismiss() {
    this.popoverController.dismiss({
      selectedCategory: 'All'
    });
  }


}
