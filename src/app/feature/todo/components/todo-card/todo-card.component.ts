import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  TodosStore,
  TTodo,
  TTodoWithNextDue,
  TTodoWithSchedule,
} from '../../todo.store';
import { DatePipe } from '@angular/common';
import { TodosService } from '../../todos.service';
import { MatButtonModule } from '@angular/material/button';
import { Entity } from '@angular-architects/ngrx-toolkit';
import { EntityId } from '@ngrx/signals/entities';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [MatCardModule, DatePipe, MatButtonModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss',
})
export class TodoCardComponent implements OnInit {
  private todosService = inject(TodosService);
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
      console.log('NEXTDUE:: ', typeof todo.nextDue, todo.nextDue);
      // this.checkDueInterval = setInterval(() => {
      // }, 5000) as unknown as number;
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

  ngOnInit(): void {
    // if (this.todo().id % 2 === 0) {
    //   setTimeout(() => {
    //     this.intervalDue.set(true);
    //   }, 2000);
    // }
  }
}
