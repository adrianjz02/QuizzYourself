import {TestBed} from '@angular/core/testing';

import {GraphServiceService} from './graph-service.service';

describe('GrapheService', () => {
  let service: GraphServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
