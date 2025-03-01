import { Component, inject, input, InputSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TTodoOccurance } from '../../../model/todo.type';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TodosService } from '../../../todos.service';
import { TodoOccurancesStore } from '../../../todoOccurances.store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDoneComponent } from '../../dialog/confirm-done/confirm-done.component';

@Component({
  selector: 'app-todo-occurance-card',
  standalone: true,
  imports: [MatCardModule, DatePipe, MatButton],
  templateUrl: './todo-occurance-card.component.html',
  styleUrl: './todo-occurance-card.component.scss',
})
export class TodoOccuranceCardComponent {
  todoOccurance = input.required<TTodoOccurance>();
  protected readonly todoOccuranceStore = inject(TodoOccurancesStore);
  todoService = inject(TodosService);
  readonly: InputSignal<boolean> = input(false);
  matDialog = inject(MatDialog);
  confirmCompleteDialog: MatDialogRef<any> | null = null;
  confirmComplete(id: number) {
    this.confirmCompleteDialog = this.matDialog.open(ConfirmDoneComponent, {
      width: '66%',
      panelClass: 'center-content',
      data: { todoId: id },
    });
  }

  markComplete = (id: number) => this.todoOccuranceStore.completeTodo(id);
  // this.todoService.markTodoOccuranceComplete(id).subscribe((res) => {
  //   if (res.ok) {
  //     console.log('SUCCESSFULLY marked todo completed');
  //   }
  // });
}
