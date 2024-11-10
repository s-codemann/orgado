import { Component, computed, inject, signal } from '@angular/core';
import { CalendarService } from '../../service/calendar.service';
import { TodosServiceService } from '../../service/todos-service.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})
export class CalendarViewComponent {
  private calendarService = inject(CalendarService);
  private todosService = inject(TodosServiceService);
  todos = toSignal(this.todosService.getTodos());
  timeFrameScale = signal(1000 * 60 * 30);
  displayTimeUnitsAmount = signal(24);
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
        todos: this.todos()?.filter((t) => {
          if (!t.due_date) return false;
          const dueDate = new Date(t.due_date);
          console.log(
            t.title,
            dueDate,
            new Date(startDateTimestamp + this.displayTimeFrame() * (i + 1))
          );
          if (
            dueDate >=
              new Date(startDateTimestamp + this.displayTimeFrame() * i) &&
            dueDate <
              new Date(startDateTimestamp + this.displayTimeFrame() * (i + 1))
          ) {
            return true;
          }
          return false;
        }),
      });
    }
    console.log('NEW TFS: ', tfs);
    return tfs;
  });
  timeFrameValue(timeframeMS: number) {
    // this.hours = tfs as any;
  }

  timeUnits = this.calendarService.getTimeUnits();
  minutes = this.timeUnits.minutes;
  hours = this.timeUnits.hours;
}
