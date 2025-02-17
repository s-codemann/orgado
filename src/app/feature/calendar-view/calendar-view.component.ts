import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  InputSignal,
  OnInit,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CalendarService } from './calendar.service';
import { TodosService } from '../todo/todos.service';
import { TodosStore, TTodoWithNextDue } from '../todo/todo.store';
import { MatIcon } from '@angular/material/icon';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

type timeFrame = 'day' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})
export class CalendarViewComponent implements OnInit, AfterViewInit {
  datePickerModel = viewChild<NgModel>('f');
  rangePicker: Signal<MatDateRangePicker<any>> =
    viewChild.required('rangePicker'); //as Signal<MatDateRangePicker<any>>;

  datePicker: Signal<MatDatepicker<any> | undefined> = viewChild('p');
  timeFrameType = signal<timeFrame>('day');
  setTimeFrameType(timeFrameType: timeFrame) {
    this.timeFrameType.set(timeFrameType);
  }

  ngAfterViewInit(): void {
    this.datePickerModel()?.valueChanges?.subscribe((v) => {
      if (isNaN(Date.parse(v))) return;
      console.log('DATEPICKER VALUE CHANGE: ', v, isNaN(Date.parse(v)));
      this.setStartDate(new Date(v));
    });
  }
  rpeffect = effect(() => {
    console.log('RP EFFECT');
    const rp = this.rangePicker();
    if (rp) {
      console.log('GOT RP: ', rp);
    }
  });
  private calendarService = inject(CalendarService);
  private todosService = inject(TodosService);
  a = effect(() => {
    console.log('TFCHANGED', this.timeFrameValues());
  });
  private readonly todosStore = inject(TodosStore);
  // todos = toSignal(this.todosService.getTodos(true));
  timeFrameScale = signal(1000 * 60 * 30);
  displayTimeUnitsAmount = signal(24);
  displayTimeFrame = signal(60 * 1000 * 60);
  setStartDate(date: Date) {
    this.startDate.set(date);
  }
  startDate = signal<Date>(new Date());
  timeFrameValues = computed(() => {
    const startDate = this.startDate();
    startDate.setMinutes(
      startDate.getMinutes() -
        (startDate.getMinutes() % (this.displayTimeFrame() / 1000 / 60))
    );
    startDate.setSeconds(0, 0);
    const startHour = new Date().getHours().toString();
    const startDateTimestamp = startDate.getTime();
    const tfs = new Array();
    console.log(this.displayTimeUnitsAmount(), this.displayTimeFrame());
    for (let i = 0; i < this.displayTimeUnitsAmount(); i++) {
      const displayDateTimeDate = new Date(
        startDateTimestamp + this.displayTimeFrame() * i
      );
      tfs.push({
        timeStr:
          displayDateTimeDate.getHours() +
          ':' +
          displayDateTimeDate.getMinutes().toString().padStart(2, '0'),
        oneOffTodos: this.todosStore.oneOffTodos()?.filter((t) => {
          // if (!t.due_date) return false;
          if (t.due_date) {
            const dueDate = new Date(t.due_date);
            if (
              dueDate >=
                new Date(startDateTimestamp + this.displayTimeFrame() * i) &&
              dueDate <
                new Date(startDateTimestamp + this.displayTimeFrame() * (i + 1))
            ) {
              return true;
            }
          }
          //  else if ((t as TTodoWithNextDue).schedule) {
          //   const nextDue = (t as TTodoWithNextDue).nextDue;

          //   if (
          //     nextDue >=
          //       new Date(startDateTimestamp + this.displayTimeFrame() * i) &&
          //     nextDue <
          //       new Date(startDateTimestamp + this.displayTimeFrame() * (i + 1))
          //   ) {
          //     return true;
          //   }
          // }
          return false;
        }),
        repeatableTodos: this.todosStore.repeatableTodos().filter((rt) => {
          const nextDue = rt.repeatableTodoSchedules.nextDue;
          if (
            nextDue >=
              new Date(startDateTimestamp + this.displayTimeFrame() * i) &&
            nextDue <
              new Date(startDateTimestamp + this.displayTimeFrame() * (i + 1))
          ) {
            return true;
          }
          return false;
        }),
      });
    }
    console.log('TFS: ', tfs);
    return tfs;
  });

  timeUnits = this.calendarService.getTimeUnits();
  minutes = this.timeUnits.minutes;
  hours = this.timeUnits.hours;

  ngOnInit(): void {
    if (this.todosStore.entities().length === 0) {
      this.todosStore.getTodos();
    }
    // setInterval(() => {
    //   const newDate = new Date(this.startDate());
    //   console.log('GOT STARTDATE: ', newDate);
    //   newDate.setHours(newDate.getHours() + 2);
    //   this.setStartDate(newDate);

    //   console.log('SET DATE: ', newDate);
    // }, 3000);
  }

  viewTodo(todoId: number) {
    console.log('VIEWTODO: ');
    this.todosService.startEditDialog(todoId);
  }
  selectedTimeframe = computed(() => this.startDate().toLocaleDateString());
  incrementDay() {
    const currentDate = new Date(this.startDate());
    currentDate.setDate(currentDate.getDate() + 1);
    this.startDate.set(currentDate);
  }
  decrementDay() {
    const currentDate = new Date(this.startDate());
    currentDate.setDate(currentDate.getDate() - 1);
    this.startDate.set(currentDate);
  }
}
