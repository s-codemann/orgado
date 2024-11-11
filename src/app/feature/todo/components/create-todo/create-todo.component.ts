import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { TimepickerComponent } from '../../../common/timepicker/timepicker.component';

@Component({
  selector: 'app-create-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatCheckboxModule,
    TimepickerComponent,
    MatRadioModule,
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
    // this.createTodoForm.valueChanges.subscribe((v) => console.log(v));
  }
  ngAfterViewInit(): void {
    // this.dueDateDp.set;
  }
  onSubmit() {
    if (this.createTodoForm.valid) {
      const [dueHours, dueMinutes] =
        this.createTodoForm.value.due_time.split(':');
      const tdate = new Date(this.createTodoForm.value.due_date);

      tdate.setHours(+dueHours);
      tdate.setMinutes(+dueMinutes);
      this.todosService
        .createTodo({ ...this.createTodoForm.value, due_date: tdate })
        .subscribe((v) => {
          v;
          this.created.emit(v);
        });
    }
  }
  dueDateDp!: MatDatepicker<HTMLInputElement>;
  showTimepicker = signal(false);
}
