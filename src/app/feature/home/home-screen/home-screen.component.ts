import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CardComponent } from '../../../core/layout/card/card.component';
import { CommonModule, DatePipe } from '@angular/common';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { OneOffTodoCardComponent } from '../../todo/components/todo-cards/one-off-todo-card/one-off-todo-card.component';
import { RepeatableTodoCardComponent } from '../../todo/components/todo-cards/repeatable-todo-card/repeatable-todo-card.component';
import { TodoOccuranceCardComponent } from '../../todo/components/todo-cards/todo-occurance-card/todo-occurance-card.component';
import { TodoViewComponent } from '../../todo/components/todo-view/todo-view.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [
    TodoCardComponent,
    OneOffTodoCardComponent,
    RepeatableTodoCardComponent,
    TodoOccuranceCardComponent,
    TodoViewComponent,
    CardComponent,
    CommonModule,
    // MatDialogModule,
    MatButtonModule,
    CreateTodoComponent,
    OverlayComponent,
    RouterLink,
    MatCardModule,
    MatIcon,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  overlayFadeOut = signal(false);
  showCreateTodo = signal(false);
  todosService = inject(TodosService);
  matDialog = inject(MatDialog);
  createTodoDialog!: MatDialogRef<CreateTodoComponent | undefined>;

  protected readonly authStore = inject(AuthStore);
  protected readonly todosStore = inject(TodosStore);

  public todoCategorySelect = viewChild<NgModel>('viewCategoryControl');

  trackSelectedCategoryEffect = effect(() => {
    if (this.todoCategorySelect()) {
      console.log('GOT CATEGORY MODEL: ', this.todoCategorySelect);
      this.readSelectedCategory();
      this.todoCategorySelect()?.valueChanges?.subscribe((v) =>
        this.saveSelectedCategory(v)
      );
    }
  });

  public viewCategoryControl!: NgModel;
  public viewCategory: string = 'due-tasks';
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
  todos = toSignal(this.todosService.getDueTodoOccurances());
  todos$ = this.getTodos();
  dueOccurances$ = this.todosService.getDueTodoOccurances();
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
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}
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
  readSelectedCategory() {
    const viewCategorySaved = localStorage.getItem('todo_view_category');
    if (viewCategorySaved) {
      this.todoCategorySelect()?.control.setValue(viewCategorySaved);
      // this.viewCategory = viewCategorySaved;
    }
  }
  saveSelectedCategory(category: string) {
    localStorage.setItem('todo_view_category', category);
  }
}
