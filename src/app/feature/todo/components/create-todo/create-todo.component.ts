import {
  AfterViewInit,
  Component,
  effect,
  EventEmitter,
  inject,
  OnInit,
  Output,
  Signal,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { TimepickerComponent } from '../../../../core/layout/common/timepicker/timepicker.component';
import { TodosService } from '../../todos.service';
import { TWeekDay } from '../../model/weekday';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

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
  private todosService = inject(TodosService);
  private dateAdapter = inject(DateAdapter);
  createTodoForm: FormGroup = this.todosService.generateCreateTodoForm();
  todoRepeatable: Signal<any> = toSignal(
    this.createTodoForm.valueChanges.pipe(
      takeUntilDestroyed(),
      map((v) => v.repeatable),
      distinctUntilChanged()
    )
  );
  handleOptionalRepeatable = effect(() => {
    // console.log('CHANGES: ', this.createTodoChanges());
    if (this.todoRepeatable()) {
      this.createTodoForm.addControl(
        'weekdaysForm',
        this.todosService.getWeekdaysGroup()
      );
    } else {
      if (this.createTodoForm.get('weekdaysForm')) {
        this.createTodoForm.removeControl('weekdaysForm');
      }
    }
  });
  // weekDaysForm!: FormGroup;
  ngOnInit(): void {
    this.dateAdapter.setLocale('de');
    // this.createTodoForm = this.todosService.generateCreateTodoForm();
    // this.weekDaysForm = ;
    // this.createTodoForm.valueChanges.subscribe((v) => console.log(v));
  }
  ngAfterViewInit(): void {
    // this.dueDateDp.set;
  }
  onSubmit() {
    console.log('VAL:', this.createTodoForm.value);

    // console.log('SELDAYS: ', selectedDays);

    // this.todosService.setTodoSchedule();
    // for(const day in selectedDays)
    // this.createTodoForm.value.weekdaysForm.reduce(
    //   (acc: TWeekDay[], curr: any) => {
    //     console.log('CURR', curr);
    //   },
    //   new Array()
    // );

    // return;
    if (this.createTodoForm.valid) {
      const value = this.createTodoForm.value;
      if (value.weekdaysForm) {
        console.log('GOT WEEKDAYS: ', value);
        const selectedDays = Object.entries(
          this.createTodoForm.value.weekdaysForm
        ).reduce((acc, curr) => {
          if (curr[1] === true) {
            acc.push(curr[0] as TWeekDay);
          }
          return acc;
        }, new Array<TWeekDay>());
        value.weekdaysForm.selectedDays = selectedDays;
        // value.weekdaysForm.time = selectedDays
        console.log('VAL AFTER SCHEDULE MAP', value, selectedDays);
      }
      if (value.due_time) {
        const [dueHours, dueMinutes] =
          this.createTodoForm.value.due_time.split(':');
        const tdate = new Date(this.createTodoForm.value.due_date);

        tdate.setHours(+dueHours);
        tdate.setMinutes(+dueMinutes);
        value.due_date = tdate;
      }
      this.todosService
        .createTodo(
          // ...this.createTodoForm.value,
          // // weekdaysForm: {
          // //   time: this.createTodoForm.value.weekdaysForm.time,
          // //   selectedDays: selectedDays,
          // // },
          value
        )
        .subscribe((v) => {
          v;
          this.created.emit(v);
        });
    }
  }
  dueDateDp!: MatDatepicker<HTMLInputElement>;
  showTimepicker = signal(false);
  showScheduleTimePicker = signal(true);
}
