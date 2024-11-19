import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { Ttodo, TtodoCreate } from './model/todo.type';

@Injectable({
  providedIn: 'root',
})
export class TodosServiceService {
  constructor(private http: HttpClient, private fb: FormBuilder) {}
  getTodos() {
    console.log(environment.backendUrl);
    return this.http.get<Ttodo[]>(environment.backendUrl + '/todos', {
      withCredentials: true,
    });
  }
  createTodo(todo: TtodoCreate) {
    return this.http.post(environment.backendUrl + '/todos', todo);
  }
  deleteTodo(todoId: number) {
    return this.http.delete(environment.backendUrl + '/todos?id=' + todoId);
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
    });
    return todosForm;
  }
}
