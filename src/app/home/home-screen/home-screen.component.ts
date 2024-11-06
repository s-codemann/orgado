import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../layout/card/card.component';
import { CommonModule } from '@angular/common';
import { CreateTodoComponent } from '../../feature/todo/components/create-todo/create-todo.component';
import { TodosServiceService } from '../../service/todos-service.service';
import { OverlayComponent } from '../../feature/common/overlay/overlay/overlay.component';
import { RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { Dialog } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
// import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [
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
  todosService = inject(TodosServiceService);
  matDialog = inject(MatDialog);
  createTodoDialog!: MatDialogRef<CreateTodoComponent | undefined>;
  // dialogRef =
  getTodos() {
    return this.todosService.getTodos().pipe(
      map((v) =>
        v.map((entry) =>
          entry.due_date
            ? { ...entry, due_date: new Date(entry.due_date) }
            : entry
        )
      ),
      tap((v) => console.log(v))
    );
  }
  todos$ = this.getTodos();
  openAdd() {
    this.createTodoDialog = this.matDialog.open(CreateTodoComponent, {
      width: '95%',
      // maxWidth: '100vw',
      panelClass: 'mat-dialog-panel',
      backdropClass: 'mat-dialog-backdrop',
      // direction: 'rtl',
    });
    console.log('opened dialog: ', this.createTodoDialog);
    this.createTodoDialog.componentInstance?.created.subscribe((c) => {
      console.log('CREATED EVENT EMIT: ', c);
      this.createTodoDialog.addPanelClass('to-bottom');
      this.todos$ = this.getTodos();
      setTimeout(() => {
        this.createTodoDialog.close();
      }, 600);
    });
  }
  ngOnInit(): void {}
  fadeToBottom() {
    console.log('matdi: ', this.matDialog, this.createTodoDialog);
    this.matDialog;
    // this.showCreateTodo.set(false);
    // this.overlayFadeOut.set(true);
    // setTimeout(() => {
    //   this.overlayFadeOut.set(false);
    // }, 600);
  }
  deleteTodo(id: number) {
    this.todosService.deleteTodo(id).subscribe((v) => {
      console.log('TODO DELETED RESULT: ', v);
      this.todos$ = this.getTodos();
    });
  }
}
