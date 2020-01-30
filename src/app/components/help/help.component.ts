import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LogService } from 'src/app/services/log.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { QueryResourceService, CommandResourceService } from 'src/app/api/services';
import { FeedbackDTO } from 'src/app/api/models';
import { KeycloakUser } from 'src/app/models/keycloak-user';
import { Util } from 'src/app/services/util';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

  helpForm: FormGroup;

  showLoading = true;

  contact = {
    mail:'jhjhsjhs@gmail.com',
    phone: '8919891898'
  }

  constructor(
    private modalController: ModalController,
    private sharedDataService: SharedDataService,
    private queryResource: QueryResourceService,
    private commadResource:CommandResourceService,
    private logger: LogService,
    private formBuilder: FormBuilder,
    private keycloakService: KeycloakService,
    private util: Util
  ) { }

  ngOnInit() {
    this.initForm();
    this.getCustomerEmail();
  }

  getCustomerEmail() {
    this.keycloakService.getUserChangedSubscription()
    .subscribe((user: KeycloakUser)=> {
      this.helpForm.value.customerEmail = user.email;
      this.helpForm.setValue(this.helpForm.value);
    })
  }

  initForm() {
    this.helpForm = this.formBuilder.group({
      customerEmail: ['', Validators.compose([Validators.required, Validators.email])],
      subject: ['', Validators.compose([Validators.required])],
      query: ['', Validators.compose([Validators.required,Validators.maxLength(400),Validators.minLength(10)])],
    })
  }

  submitForm() {
    console.error(this.helpForm.value);
    this.commadResource.createFeedbackUsingPOST(this.helpForm.value)
    .subscribe(feedbackdto=> {
      this.logger.info(feedbackdto);
      this.util.createToast('FeedBack Submitted Ticket ID ' + feedbackdto.ticketId , undefined,10000);
      this.helpForm.setValue({
        customerEmail:'',
        subject:'',
        query: ''
      })
    },err=> {
      this.util.createToast('Ferror Submitting Feedback');
    })
  }

  
  isDisabled() {
    return !this.helpForm.valid;
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
