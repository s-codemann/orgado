import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { Ttodo, TtodoCreate, TTodoOccurance } from './model/todo.type';
import { TTodo } from './todo.store';
import { TCreateTodoForm } from './model/forms';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private http: HttpClient, private fb: FormBuilder) {}
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
  createTodo(todo: TtodoCreate) {
    return this.http.post(environment.backendUrl + '/todos', todo);
  }
  deleteTodo(todoId: number) {
    return this.http.delete(environment.backendUrl + '/todos?id=' + todoId);
  }
  setTodoSchedule(todoId: number, schedule: string) {
    return this.http.post(
      environment.backendUrl + '/todos/' + todoId + '/schedule',
      { schedule }
    );
  }

  generateCreateTodoForm() {
    const todosForm = this.fb.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl('', [Validators.minLength(2)]),
      due_date: new FormControl('', []),
      due_time: new FormControl('', []),
      repeatable: new FormControl(false),
    });
    return todosForm;
  }
  generateEditTodoForm() {
    const editForm = this.fb.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl('', [Validators.minLength(2)]),
      due_date: new FormControl('', []),
      due_time: new FormControl('', []),
      repeatable: new FormControl(false),
    });
    return editForm;
  }
  getWeekdaysGroup() {
    return new FormGroup({
      time: new FormControl('', [Validators.required]),
      days: new FormGroup({
        mo: new FormControl(false),
        di: new FormControl(false),
        mi: new FormControl(false),
        do: new FormControl(false),
        fr: new FormControl(false),
        sa: new FormControl(false),
        so: new FormControl(false),
      }),
    });
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
}
