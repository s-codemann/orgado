import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../../core/layout/card/card.component';
import { CommonModule } from '@angular/common';
import { CreateTodoComponent } from '../../todo/components/create-todo/create-todo.component';
import { OverlayComponent } from '../../../core/layout/common/overlay/overlay/overlay.component';
import { RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule, MatMiniFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AuthStore } from '../../../core/auth/store/auth.store';
import { TodosService } from '../../todo/todos.service';
import { TodosStore } from '../../todo/todo.store';
import { TodoCardComponent } from '../../todo/components/todo-card/todo-card.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [
    TodoCardComponent,
    CardComponent,
    CommonModule,
    // MatDialogModule,
    MatButtonModule,
    CreateTodoComponent,
    OverlayComponent,
    RouterLink,
    MatCardModule,
    MatIcon,
  ],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent implements OnInit {
  overlayFadeOut = signal(false);
  showCreateTodo = signal(false);
  todosService = inject(TodosService);
  matDialog = inject(MatDialog);
  createTodoDialog!: MatDialogRef<CreateTodoComponent | undefined>;
  protected readonly authStore = inject(AuthStore);
  protected readonly todosStore = inject(TodosStore);
  // dialogRef =
  getTodos() {
    return this.todosService.getTodos().pipe(
      tap((v) => console.log('TODUU', v)),
      map((v) =>
        v.map((entry) =>
          entry.due_date
            ? { ...entry, due_date: new Date(entry.due_date) }
            : entry
        )
      )
    );
  }
  todos$ = this.getTodos();
  openAdd() {
    history.pushState(
      { stage: 'beforedialog' },
      'beforedialog',
      window.location.href
    );
    this.createTodoDialog = this.matDialog.open(CreateTodoComponent, {
      width: '95%',
      height: '80%',
      panelClass: 'mat-dialog-panel',
      backdropClass: 'mat-dialog-backdrop',
      closeOnNavigation: true,
    });
    this.createTodoDialog.componentInstance?.created.subscribe((c) => {
      this.createTodoDialog.addPanelClass('to-bottom');
      // this.todos$ = this.getTodos();
      console.log('CREATED RESULT: ', c);
      if (!(c instanceof HttpErrorResponse)) {
        this.todosStore.addTodo(c);
      }
      setTimeout(() => {
        this.createTodoDialog.close();
      }, 600);
    });
  }
  teffect = effect(() => {
    console.log('STORE TODOS: ', this.todosStore.todos());
    console.log('STORE TODOS Entity: ', this.todosStore.entityMap());
    console.log('STORE TODOS Entities: ', this.todosStore.entities());
  });
  ngOnInit(): void {
    this.todosStore.getTodos();
  }
  fadeToBottom() {
    this.matDialog;
    // this.showCreateTodo.set(false);
    // this.overlayFadeOut.set(true);
    // setTimeout(() => {
    //   this.overlayFadeOut.set(false);
    // }, 600);
  }
  deleteTodo(id: number) {
    this.todosService.deleteTodo(id).subscribe((v) => {
      this.todos$ = this.getTodos();
    });
  }
}
