import { inject, Injectable } from '@angular/core';
import { TodosStore } from '../todo.store';

@Injectable({
  providedIn: 'root',
})
export class TodoStoreUpdaterService {
  constructor() {}
  // private todosStore = inject(TodosStore);
}
