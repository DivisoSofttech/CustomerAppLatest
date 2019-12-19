import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { QueryResourceService } from 'src/app/api/services/query-resource.service';
import { Util } from 'src/app/services/util';
import { CommandResourceService } from 'src/app/api/services';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CountdownTimer, CountdownComponent } from 'ngx-countdown';
import { NGXLogger } from 'ngx-logger';
declare var SMSReceive: any;

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {

  user;
  password;
  rePassword;
  showOtp = false;
  numberValid = true;
  otpVerification;

  passwordMatch = true;
  passwordValid = true;
  otpInvalid = false;
  buttonDisabled = true;

  number;

  expire = '5:00';

  @ViewChild('timer' , { static: false }) timer: CountdownComponent;
  OTP: string;
  OTPmessage: string;
  fullNumber: any;


  constructor(
    private modal: ModalController,
    private storage: Storage,
    private commandResource: CommandResourceService,
    private util: Util,
    private query: QueryResourceService,
    private keycloakService: KeycloakService,
    private logger: NGXLogger
    ) { }

  ngOnInit() {
    this.storage.get('user')
    .then(user => {
      this.user = user;
      console.log(user);
    });
  }

  dismiss() {
    this.modal.dismiss();
  }

  checkInputMatch() {
    if (this.password === this.rePassword) {
      this.passwordMatch = true;
      this.buttonDisabled = false;
    } else {
      this.passwordMatch = false;
      this.buttonDisabled = true;
    }
  }

  checkPasswordValid() {
    // const regx = /^[A-Za-z]\w{7,14}$/;
    // if (regx.test(this.password)) {
    //   console.log('true)');
    //   this.passwordValid = true;
    //   this.buttonDisabled = false;
    // } else {
    //   console.log('false');
    //   this.passwordValid = false;
    //   this.buttonDisabled = true;
    // }
    return true;
  }

  updatePassword(user) {
    this.keycloakService.ForgetPassword(user, this.password, () => {
      this.util.createToast('Passsword reset success');
      this.modal.dismiss();
    }, err => {
      console.log('reset', err);
      this.util.createToast('Passsword reset failed');
    });
  }

  sendOtp() {
    this.logger.info('Senfing OTP');
    if (this.numberValid === true) {
      this.query.findByMobileNumberUsingGET(this.number).subscribe(user => {
        this.user = user;
        console.log(this.user);
        this.initSMSSender();
        this.showOtp = true;
      }, err => {
        if (err.status === '500') {
          this.util.createToast('Unregistered Mobile Number');
        } else {
          this.util.createToast('Cannot Find Number');
        }
      });
    }
  }

  initSMSSender() {
    this.commandResource.sendSMSUsingPOST(this.fullNumber).subscribe(data => {
      // this.startSMSListener();
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
      this.commandResource.verifyOTPUsingPOST({
        numbers: this.number,
        code: this.OTP
      }).subscribe(d => {
        this.otpVerification = d;
        this.updatePassword(this.user);
        console.log('otp-verification', d);
      } , err => {
        this.util.createToast('Invalid API Key');
      });
  }

  autoProcessSMS(data) {
    const message = data.body;
    if (message && message.indexOf('enappd_starters') !== -1) {
      this.OTP = data.body.slice(0, 5);

      this.commandResource.verifyOTPUsingPOST({
        numbers: this.number,
        code: this.OTP
      }).subscribe(d => {

      } , err => {
        this.util.createToast('Invalid API Key');
      });

      this.OTPmessage = 'OTP received. Proceed to register';
      this.stopSMSListener();
    }
  }

  resend() {
    this.stopSMSListener();
    this.initSMSSender();
    this.timer.restart();
  }

  checkNumber(event) {
    this.numberValid  = event.valid
    let code = event.extra.numberCode;
    this.fullNumber = event.value;
    this.number = event.value.slice(code.toString().length , event.value.length);
  }

}
