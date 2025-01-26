import { Component, input } from '@angular/core';

@Component({
  selector: 'app-schedule-view',
  standalone: true,
  imports: [],
  templateUrl: './schedule-view.component.html',
  styleUrl: './schedule-view.component.scss',
})
export class ScheduleViewComponent {
  todoSchedule = input.required();
}
