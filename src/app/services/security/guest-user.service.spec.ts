import { TestBed } from '@angular/core/testing';

import { GuestUserService } from './guest-user.service';

describe('GuestUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuestUserService = TestBed.get(GuestUserService);
    expect(service).toBeTruthy();
  });
});
