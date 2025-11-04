import { TestBed } from '@angular/core/testing';

import { DBRequestor } from './dbrequestor';

describe('DBRequestor', () => {
  let service: DBRequestor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBRequestor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
