import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreorderComponent } from './preorder.component';

describe('PreorderComponent', () => {
  let component: PreorderComponent;
  let fixture: ComponentFixture<PreorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreorderComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
