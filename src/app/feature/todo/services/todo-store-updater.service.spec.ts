import { TestBed } from '@angular/core/testing';

import { TodoStoreUpdaterService } from './todo-store-updater.service';

describe('TodoStoreUpdaterService', () => {
  let service: TodoStoreUpdaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoStoreUpdaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
