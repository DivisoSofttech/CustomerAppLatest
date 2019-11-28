import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorService } from 'src/app/services/error.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  refresh() {
    this.modalController.dismiss();
  }
}
