import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { QueryResourceService, CommandResourceService } from 'src/app/api/services';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { NGXLogger } from 'ngx-logger';
import { log } from 'util';
declare var SMSReceive: any;

@Component({
  selector: 'app-phone-number-verfication',
  templateUrl: './phone-number-verfication.component.html',
  styleUrls: ['./phone-number-verfication.component.scss'],
})
export class PhoneNumberVerficationComponent implements OnInit {

  @Input() number;

  expire = '5:00';

  @ViewChild('timer' , null) timer;
  OTP: any;
  OTPmessage: string;

  constructor(
    private modalController: ModalController,
    private util: Util,
    private queryResource: QueryResourceService,
    private commandResource: CommandResourceService,
    private keycloakService: KeycloakService,
    private logger: NGXLogger,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.initSMSSender();
  }

  initSMSSender() {
    this.util.createCustomLoader('circles', 'Sending OTP').then(loader => {
      loader.present();
      this.commandResource.sendSMSUsingPOST(this.number).subscribe(data => {
      loader.dismiss();
      this.util.createToast('OTP has been sent to your mobile');
      if (this.platform.is('android' || 'ios')) {
          this.startSMSListener();
      }
    }, () => loader.dismiss());
  });
  }

  startSMSListener() {
    if (SMSReceive) {
      SMSReceive.startWatch(
        () => {
          document.addEventListener('onSMSArrive', (e: any) => {
            const IncomingSMS = e.data;
            this.autoProcessSMS(IncomingSMS);
          });
        },
        () => { console.log('watch start failed'); }
      );
    }
  }

  stopSMSListener() {
    if (SMSReceive) {
      SMSReceive.stopWatch(
        () => { console.log('watch stopped'); },
        () => { console.log('watch stop failed'); }
      );
    }
  }

  manualProcess() {
    this.util.createCustomLoader('circles', 'Verfying OTP').then(loader => {
      loader.present();
      this.commandResource.verifyOTPUsingPOST({
        numbers: this.number,
        code: this.OTP
      }).subscribe(d => {
        loader.dismiss();
        if (d.status === 'success') {
          this.dismissData(true);
        } else {
          this.util.createToast('Invalid OTP');
        }
      } , err => {
        loader.dismiss();
        this.util.createToast('Error Validating OTP ');
      });
    });
  }

  autoProcessSMS(data) {
    const message = data.body;
    const sender = data.address;
    console.log('The sender of sms is ', data.address);
    if (sender === 'VK-040060' || 'VM-040060' || 'AD-040060' || 'Foodexp' || 'BP-080001' ) {
      this.OTP = data.body.slice((message.length - 5), message.length);
      console.log('OTP is readed is ', this.OTP);
      this.util.createCustomLoader('circles', 'Verfying OTP').then(loader => {
      loader.present();
      this.commandResource.verifyOTPUsingPOST({
        numbers: this.number,
        code: this.OTP
      }).subscribe(d => {
        loader.dismiss();
        if (d.status === 'success') {
          this.dismissData(true);
        } else {
          this.util.createToast('Invalid OTP');
        }
      } , err => {
        loader.dismiss();
        this.util.createToast('Error Validating OTP ');
      });
    });

      this.OTPmessage = 'OTP received. Proceed to register';
      this.stopSMSListener();
    } else {
      this.logger.info(sender);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
  dismissData(data) {
    this.modalController.dismiss({numberVerified: data});
  }

  resend() {
    this.stopSMSListener();
    this.initSMSSender();
    this.timer.restart();
  }

  timerEvent(event) {
    if (event.action === 'done') {
      // alert('OTP Expired');
    }
  }

}
