import { TestBed } from '@angular/core/testing';

import { IncidentListStore } from './incident-list.store';

describe('IncidentListStore', () => {
  let service: IncidentListStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentListStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
