import { Component, inject } from '@angular/core';
import { CalendarService } from '../../service/calendar.service';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})
export class CalendarViewComponent {
  private calendarService = inject(CalendarService);
  timeUnits = this.calendarService.getTimeUnits();
  minutes = this.timeUnits.minutes;
  hours = this.timeUnits.hours;
}
