import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../layout/card/card.component';
import { CommonModule } from '@angular/common';
import { CreateTodoComponent } from '../../feature/todo/components/create-todo/create-todo.component';
import { TodosServiceService } from '../../service/todos-service.service';
import { OverlayComponent } from '../../feature/common/overlay/overlay/overlay.component';
import { RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
// import { Dialog } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
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
  ],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent implements OnInit {
  overlayFadeOut = signal(false);
  showCreateTodo = signal(false);
  todosService = inject(TodosServiceService);
  matDialog = inject(MatDialog);
  // dialogRef =
  todos$ = this.todosService.getTodos().pipe(
    map((v) =>
      v.map((entry) =>
        entry.due_date
          ? { ...entry, due_date: new Date(entry.due_date) }
          : entry
      )
    ),
    tap((v) => console.log(v))
  );
  openAdd() {
    this.matDialog.open(CreateTodoComponent, {
      width: '95%',
      // maxWidth: '100vw',
      // panelClass: 'mat-dialog-panel',
      backdropClass: 'mat-dialog-backdrop',
      // direction: 'rtl',
    });
  }
  ngOnInit(): void {}
  fadeToBottom() {
    this.showCreateTodo.set(false);
    this.overlayFadeOut.set(true);
    setTimeout(() => {
      this.overlayFadeOut.set(false);
    }, 600);
  }
}
