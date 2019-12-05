import { TestBed } from '@angular/core/testing';

import { PaymentNavService } from './payment-nav.service';

describe('PaymentNavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentNavService = TestBed.get(PaymentNavService);
    expect(service).toBeTruthy();
  });
});
