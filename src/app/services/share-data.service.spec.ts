import { TestBed } from '@angular/core/testing';

import { ShareDataService } from './share-data.service';

describe('TemporaryDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareDataService = TestBed.get(ShareDataService);
    expect(service).toBeTruthy();
  });
});
