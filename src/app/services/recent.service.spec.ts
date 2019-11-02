import { TestBed } from '@angular/core/testing';

import { RecentService } from './recent.service';

describe('RecentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecentService = TestBed.get(RecentService);
    expect(service).toBeTruthy();
  });
});
