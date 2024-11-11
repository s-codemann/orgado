import { TestBed } from '@angular/core/testing';

import { TodosServiceService } from './todos-service.service';

describe('TodosServiceService', () => {
  let service: TodosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
