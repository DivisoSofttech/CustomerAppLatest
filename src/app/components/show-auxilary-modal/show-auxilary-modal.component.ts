import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-show-auxilary-modal',
  templateUrl: './show-auxilary-modal.component.html',
  styleUrls: ['./show-auxilary-modal.component.scss'],
})
export class ShowAuxilaryModalComponent implements OnInit {

  @Input() auxilaryItems = [];

  constructor() { }

  ngOnInit() {
    console.log(this.auxilaryItems);
  }

}
