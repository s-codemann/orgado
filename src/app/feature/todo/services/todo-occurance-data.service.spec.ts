import { TestBed } from '@angular/core/testing';

import { TodoOccuranceDataService } from './todo-occurance-data.service';

describe('TodoOccuranceDataService', () => {
  let service: TodoOccuranceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoOccuranceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
