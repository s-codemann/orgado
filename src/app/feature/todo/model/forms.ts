import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TTodo } from '../todo.store';

export type TCreateTodoFormBase = Omit<
  TTodo,
  keyof {
    id: number;
    created_at: 'string';
    updated_at: 'string';
    due_time: string;
  }
>;

export type TRepeatableTodo = TCreateTodoFormBase & {
  repeatable: true;
  weekdaysForm: FormGroup<any>;
  schedules: FormArray<any>;
};

export type TOneOffTodo = TCreateTodoFormBase & {
  repeatable: false;
};

export type TCreateTodoForm = TRepeatableTodo | TOneOffTodo;

// const good: TCreateTodoForm = {
//   repeatable: false,
//   title: 'haha',
//   userId: 1,
//   description: null,
//   weekdaysForm: new FormGroup({}),
//   schedules: new FormArray([new FormControl(null)]),
//   due_date: new Date()
// };
export type TTodoForm = TCreateTodoForm & { userId?: number };
