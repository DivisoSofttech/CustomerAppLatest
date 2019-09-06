import { TestBed } from '@angular/core/testing';

import { ModalDisplayUtilService } from './modal-display-util.service';

describe('ModalDisplayUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalDisplayUtilService = TestBed.get(ModalDisplayUtilService);
    expect(service).toBeTruthy();
  });
});
