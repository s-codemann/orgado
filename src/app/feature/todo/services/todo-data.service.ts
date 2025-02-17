import { inject, Injectable } from '@angular/core';
import { TtodoCreate, TTodoOccurance } from '../model/todo.type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { TTodo } from '../todo.store';

@Injectable({
  providedIn: 'root',
})
export class TodoDataService {
  constructor() {}
  private http = inject(HttpClient);
  createTodo(todo: TtodoCreate) {
    return this.http.post(environment.backendUrl + '/todos', todo);
  }
  getTodos(withSchedule: boolean = false) {
    console.log(environment.backendUrl);
    return this.http.get<TTodo[]>(
      environment.backendUrl +
        '/todos' +
        ((withSchedule && '?schedule=true') || ''),
      {
        withCredentials: true,
      }
    );
  }

  getDueTodoOccurances() {
    return this.http.get<TTodoOccurance[]>(
      environment.backendUrl + '/todo-occurances/due'
    );
  }
  getTodoOccurances() {
    return this.http.get<TTodoOccurance[]>(
      environment.backendUrl + '/todo-occurances'
    );
  }
  getCompletedTasks() {
    return this.http.get(environment.backendUrl + '/todo-occurances/completed');
  }

  markTodoOccuranceComplete(todoOccuranceId: number) {
    return this.http.post(
      environment.backendUrl +
        '/todo-occurances/' +
        todoOccuranceId +
        '/complete',
      {},
      { withCredentials: true, observe: 'response', responseType: 'text' }
    );
  }

  updateTodo(todo: Partial<TTodo> & { id: number }) {
    return this.http.put(environment.backendUrl + '/todos/' + todo.id, todo);
  }
  deleteTodo(todoId: number) {
    return this.http.delete(environment.backendUrl + '/todos/' + todoId);
  }
  getTodosInTimeframe(config: any) {
    return this.http.post(environment.backendUrl + '/todo-occurances', config);
  }
}
