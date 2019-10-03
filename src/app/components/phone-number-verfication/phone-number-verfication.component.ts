import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Util } from 'src/app/services/util';
import { QueryResourceService, CommandResourceService } from 'src/app/api/services';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { NGXLogger } from 'ngx-logger';
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
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.initSMSSender();
  }

  initSMSSender() {
    this.commandResource.sendSMSUsingPOST(this.number).subscribe(data => {
      this.startSMSListener();
    });
  }

  startSMSListener() {
    if(SMSReceive) {
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
    if(SMSReceive) {
      SMSReceive.stopWatch(
        () => { console.log('watch stopped'); },
        () => { console.log('watch stop failed'); }
      );  
    }
  }

  manualProcess() {
    this.commandResource.verifyOTPUsingPOST({
      numbers: this.number,
      code: this.OTP
    }).subscribe(d => {
      if(d.status === 'success') {
        this.dismissData(true);
      } else {
        this.util.createToast('Invalid OTP');
      }
    } , err => {
      this.util.createToast('Error Validating OTP ');
    });
  }

  autoProcessSMS(data) {
    const message = data.body;
    const sender = data.address;
    if (sender === 'VK-040060') {
      this.OTP = data.body.slice((message.length - 6), message.length - 1);

      this.commandResource.verifyOTPUsingPOST({
        numbers: this.number,
        code: this.OTP
      }).subscribe(d => {
        if(d.status === 'success') {
          this.dismissData(true);
        } else {
          this.util.createToast('Invalid OTP');
        }
      } , err => {
        this.util.createToast('Error Validating OTP ');
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
    if(event.action === 'done') {
      // alert('OTP Expired');
    }
  }

}
