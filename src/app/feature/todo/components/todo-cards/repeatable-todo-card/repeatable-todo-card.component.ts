import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  TodosStore,
  TTodo,
  TTodoWithSchedule,
  TTodoWithNextDue,
} from '../../../todo.store';
import { TodosService } from '../../../todos.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-repeatable-todo-card',
  standalone: true,

  imports: [MatCardModule, DatePipe, MatButtonModule, MatIcon],

  templateUrl: './repeatable-todo-card.component.html',
  styleUrl: './repeatable-todo-card.component.scss',
})
export class RepeatableTodoCardComponent {
  edit = output<number>();
  // edit() {
  //   this.router.navigateByUrl(
  //     '(overlay:' + '/todos/' + this.todo().id + '/edit)'
  //   );
  // }
  private todosService = inject(TodosService);
  private router = inject(Router);
  protected readonly todosStore = inject(TodosStore);
  readonly todo = input.required<TTodo | TTodoWithSchedule>();
  getTodos = this.todosService.getTodos;
  todos$!: any;

  deleteTodo(id: number) {
    this.todosService.deleteTodo(id).subscribe((v) => {
      this.todos$ = this.getTodos();
    });
  }
  checkDueInterval?: number;
  intervalDue: WritableSignal<boolean> = signal(false);

  dueNowEffect = effect(() => {
    if (this.todo().repeatable) {
      const todo = this.todo() as TTodoWithNextDue;
      if (this.checkDueInterval) {
        clearTimeout(this.checkDueInterval);
      }
      this.checkDueInterval = setTimeout(() => {
        this.intervalDue.set(true),
          setTimeout(() => this.intervalDue.set(false), 5000);
        this.todosStore.updateAfterDue(todo);
      }, todo.repeatableTodoSchedules.nextDue!.getTime() - Date.now()) as unknown as number;
    }
  });
}
