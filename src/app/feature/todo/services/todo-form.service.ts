import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TtodoCreate } from '../model/todo.type';

@Injectable({
  providedIn: 'root',
})
export class TodoFormService {
  constructor(private fb: FormBuilder) {}

  createTodoForm() {
    this.fb.group({});
  }

  getWeekdaysGroup() {
    const group = this.fb.record({});
    // group.addControl('title', ['']);
    // return new FormGroup({
    //   time: new FormControl('', [Validators.required]),
    //   days: new FormGroup({
    //     mo: new FormControl(false),
    //     di: new FormControl(false),
    //     mi: new FormControl(false),
    //     do: new FormControl(false),
    //     fr: new FormControl(false),
    //     sa: new FormControl(false),
    //     so: new FormControl(false),
    //   }),
    // });
  }
}
