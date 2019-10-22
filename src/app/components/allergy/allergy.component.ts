import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Store } from 'src/app/api/models';

@Component({
  selector: 'app-allergy',
  templateUrl: './allergy.component.html',
  styleUrls: ['./allergy.component.scss'],
})
export class AllergyComponent implements OnInit {

  store: Store;
  msg: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  dismissData() {
    this.modalController.dismiss(this.msg);
  }

}
