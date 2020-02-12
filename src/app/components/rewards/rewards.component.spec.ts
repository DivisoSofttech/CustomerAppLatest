import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsComponent } from './rewards.component';

describe('RewardsComponent', () => {
  let component: RewardsComponent;
  let fixture: ComponentFixture<RewardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
