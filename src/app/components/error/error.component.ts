import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {

  @Input() isOnline = false;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  refresh() {
    this.modalController.dismiss();
  }
}
