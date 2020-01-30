import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';

@Component({
  selector: 'app-terms-and-policy',
  templateUrl: './terms-and-policy.component.html',
  styleUrls: ['./terms-and-policy.component.scss'],
})
export class TermsAndPolicyComponent implements OnInit {


  constructor(
    private modalController: ModalController,
    private queryResourceService: QueryResourceService,
    ) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

}
