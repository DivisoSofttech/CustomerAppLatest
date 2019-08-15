import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWiseProductsCardComponent } from './category-wise-products-card.component';

describe('CategoryWiseProductsCardComponent', () => {
  let component: CategoryWiseProductsCardComponent;
  let fixture: ComponentFixture<CategoryWiseProductsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryWiseProductsCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWiseProductsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
