import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { KeycloakService } from 'src/app/services/security/keycloak.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LogService } from 'src/app/services/log.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

  helpForm: FormGroup;

  contact = {
    mail:'jhjhsjhs@gmail.com',
    phone: '8919891898'
  }

  constructor(
    private modalController: ModalController,
    private sharedDataService: SharedDataService,
    private logger: LogService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.getCustomer();
  }

  initForm() {
    this.helpForm = this.formBuilder.group({
      number: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      subject: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required,Validators.maxLength(400),Validators.minLength(10)])],
    })
  }

  getCustomer() {
    this.sharedDataService.getData('contact')
    .then(data => {
      this.helpForm.value.number = data.mobileNumber;
      this.helpForm.value.email = data.email;
      this.helpForm.setValue(this.helpForm.value);
    })  
  }

  isDisabled() {
    return !this.helpForm.valid;
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
