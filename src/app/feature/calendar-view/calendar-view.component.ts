import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CalendarService } from './calendar.service';
import { TodosService } from '../todo/todos.service';
import { TodosStore, TTodoWithNextDue } from '../todo/todo.store';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})
export class CalendarViewComponent implements OnInit {
  private calendarService = inject(CalendarService);
  private todosService = inject(TodosService);
  a = effect(() => {
    console.log('TFCHANGED', this.timeFrameValues());
  });
  private readonly todosStore = inject(TodosStore);
  // todos = toSignal(this.todosService.getTodos(true));
  timeFrameScale = signal(1000 * 60 * 30);
  displayTimeUnitsAmount = signal(20);
  displayTimeFrame = signal(60 * 1000 * 60);
  timeFrameValues = computed(() => {
    const startDate = new Date();
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
          console.log('REPEATABLE NEXTDUE: ', nextDue, rt);
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
    console.log('ONINIT', this.todosStore.entities());
    if (this.todosStore.entities().length === 0) {
      this.todosStore.getTodos();
    }
  }
}
