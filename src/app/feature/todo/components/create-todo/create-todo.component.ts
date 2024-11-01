import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TodosServiceService } from '../../../../service/todos-service.service';
// import { MatDatePickerModule } from '@angular/material';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-create-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-todo.component.html',
  styleUrl: './create-todo.component.scss',
})
export class CreateTodoComponent implements OnInit, AfterViewInit {
  @Output() created = new EventEmitter();
  private todosService = inject(TodosServiceService);
  private dateAdapter = inject(DateAdapter);
  createTodoForm!: FormGroup;
  ngOnInit(): void {
    this.dateAdapter.setLocale('de');
    this.createTodoForm = this.todosService.generateCreateTodoForm();
  }
  ngAfterViewInit(): void {
    // this.dueDateDp.set;
  }
  onSubmit() {
    console.log(this.createTodoForm.value, this.createTodoForm.valid);
    if (this.createTodoForm.valid) {
      this.todosService.createTodo(this.createTodoForm.value).subscribe((v) => {
        console.log(v);
        this.created.emit(v);
      });
    }
  }
  dueDateDp!: MatDatepicker<HTMLInputElement>;
}
