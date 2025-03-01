import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { TodosStore, TTodo } from '../../../todo.store';
import { TodoOccuranceCardComponent } from '../../todo-cards/todo-occurance-card/todo-occurance-card.component';
import { TodoOccurancesStore } from '../../../todoOccurances.store';
import { DatePipe, JsonPipe } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TTodoOccurance } from '../../../model/todo.type';
import { RepeatableTodoCardComponent } from '../../todo-cards/repeatable-todo-card/repeatable-todo-card.component';
import { OneOffTodoCardComponent } from '../../todo-cards/one-off-todo-card/one-off-todo-card.component';

@Component({
  selector: 'app-confirm-done',
  standalone: true,
  imports: [DatePipe, TodoOccuranceCardComponent],
  templateUrl: './confirm-done.component.html',
  styleUrl: './confirm-done.component.scss',
})
export class ConfirmDoneComponent implements OnInit, OnDestroy {
  todosStore = inject(TodosStore);
  todoOccuranceStore = inject(TodoOccurancesStore);
  dialogData = inject(MAT_DIALOG_DATA);
  todo: WritableSignal<TTodoOccurance> = signal(
    this.todoOccuranceStore.entityMap()[this.dialogData.todoId]
  );
  completedTime = signal(Date.now());
  updateCompletedTimeIntv!: ReturnType<typeof setInterval>;
  ngOnInit(): void {
    this.updateCompletedTimeIntv = setInterval(() => {
      this.completedTime.set(Date.now());
    });
    console.log(
      'dialogdata: ',
      this.dialogData,
      this.todoOccuranceStore.entityMap()[this.dialogData.todoId]
    );
    // this.todo.set();
  }
  ngOnDestroy(): void {
    clearInterval(this.updateCompletedTimeIntv);
  }
}
