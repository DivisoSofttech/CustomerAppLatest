import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as googleLibphonenumber from 'google-libphonenumber';
import * as countryList from 'country-list';
import { ModalController, LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Sim } from '@ionic-native/sim/ngx';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-intl-number-input',
  templateUrl: './intl-number-input.component.html',
  styleUrls: ['./intl-number-input.component.scss'],
})
export class IntlNumberInputComponent implements OnInit {

  @Input() viewType = 'enter';

  countryList = [];

  supportedCountries  = ['IN', 'IE'];

  selectedCountry = {numberCode: '0' , name: '' , code: ''};

  putil =  googleLibphonenumber.PhoneNumberUtil.getInstance();

  phoneNumber = '';

  numberValid = true;

  codeValid = true;

  searchTerm = '';

  @Output() validEvent = new EventEmitter<any>();

  sim: Sim;
  tmpCountryList: any[];

  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private loadingController: LoadingController,
    private logger: NGXLogger,
    private platform: Platform
  ) {
    if (!this.platform.is('pwa')) {
    this.sim = new Sim();
    }
   }

  ngOnInit() {
   if (this.viewType === 'list') {
     this.createLoader()
     .then(loader => {
       loader.present();
       this.getCountryList(() => {
         loader.dismiss();
         this.getSimInfo();
       });
     });
   }
  }

  async createLoader() {
    return await this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000
    });
  }

  getSimInfo() {
    this.sim.requestReadPermission().then(
      () => {
        this.sim.getSimInfo().then(
          (info) => {
            this.phoneNumber = info.mcc + info.phoneNumber;
            this.selectedCountry = this.countryList.find(c => {
              return c.code === info.countryCode;
            });
          },
          (err) => {
            this.logger.error('Unable to get sim details');
          }
        );
      },
      () => this.logger.info('Persmission Denied')
    );
  }

  getCountryList(success) {
    const tmpArray = [];
    this.storage.get('countries')
    .then(data => {
      if (data === null || data.length === 0) {
        this.putil.getSupportedRegions()
        .forEach(cc => {
          if(this.supportedCountries.includes(cc,0)) {
            const cd = this.putil.getCountryCodeForRegion(cc);
            const cn = countryList.getName(cc);
            if (cn !== undefined) {
              tmpArray.push({numberCode: cd , name: cn , code: cc});
            }
          }
        });
        this.tmpCountryList = tmpArray;  
        this.countryList = tmpArray;
        this.storage.set('countries' , this.countryList);
        success();
      } else {
        this.countryList = data;
        success();
      }
    });
  }

  async countrySelectModal() {
    const modal = await this.modalController.create({
      component: IntlNumberInputComponent,
      componentProps: {viewType: 'list'}
    });
    modal.onDidDismiss()
    .then(data => {
      if (data.data !== undefined) {
        this.selectedCountry = data.data ;
        console.log('Selected' , data);
      }
      this.checkIfValid();
    });
    modal.present();
  }

  dismissData() {
    this.modalController.dismiss(this.selectedCountry);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.dismissData();
  }

  checkIfValid() {
    try {
      if (this.selectedCountry.code !== '') {
        const pnumb = this.putil.parseAndKeepRawInput(this.phoneNumber, this.selectedCountry.code);
        if (this.putil.isValidNumber(pnumb)) {
          console.log('Valid Number');
          this.numberValid = true;
          this.codeValid = true;
        } else {
          console.log('Invalid Number');
          this.numberValid = false;
          this.codeValid = true;
        }
      } else {
        this.codeValid = false;
      }

      this.validEvent.emit({
        valid: this.numberValid && this.codeValid,
        value: this.selectedCountry.numberCode + this.phoneNumber,
        extra: this.selectedCountry
      });
    } catch (e) {
      console.log('Not a Phone Number');
      this.numberValid = false;
    }
  }

  searchCountry() {
    this.logger.info('Searching...' , this.searchTerm);
    if(this.searchTerm === '') {
      this.countryList = this.tmpCountryList;
    } else {
      this.countryList = this.tmpCountryList.filter(c => c.name.includes(this.searchTerm ));  
    }
  }

}
