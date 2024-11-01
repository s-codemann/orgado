import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Ttodo, TtodoCreate } from '../feature/todo/types/todo.type';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TodosServiceService {
  constructor(private http: HttpClient, private fb: FormBuilder) {}
  getTodos() {
    console.log(environment.backendUrl);
    return this.http.get<Ttodo[]>(environment.backendUrl + '/todos');
  }
  createTodo(todo: TtodoCreate) {
    return this.http.post(environment.backendUrl + '/todos', todo);
  }

  generateCreateTodoForm() {
    const todosForm = this.fb.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl('', [Validators.minLength(2)]),
      due_date: new FormControl('', []),
    });
    return todosForm;
  }
}