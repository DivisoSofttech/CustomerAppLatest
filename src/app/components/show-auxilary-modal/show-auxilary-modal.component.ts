import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-auxilary-modal',
  templateUrl: './show-auxilary-modal.component.html',
  styleUrls: ['./show-auxilary-modal.component.scss'],
})
export class ShowAuxilaryModalComponent implements OnInit {

  @Input() auxilaryItems = [];

  @Input() product;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }
}
