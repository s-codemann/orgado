import { inject, Injectable } from '@angular/core';
import cronParser from 'cron-parser';
import { TTodoWithSchedule } from '../../feature/todo/todo.store';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor() {}
  cronParser = cronParser;
  parseCronSchedule(cronExpression: string, endDate?: Date) {
    return cronParser.parseExpression(cronExpression, {
      endDate: endDate || undefined,
    });
  }
  getNextDue(todo: any) {
    const schedules = todo.repeatableTodoSchedules;
    console.log('COMPUTE NEXT DUE FOR ', todo, todo.repeatableTodoSchedules);
    const nextDue = todo.repeatableTodoSchedules
      .reduce((acc: any, curr: any) => {
        const schedule = this.parseCronSchedule(curr.cron_schedule);
        const nextDue = schedule.next().toDate().getTime();
        acc.push(nextDue);
        return acc;
      }, new Array())
      .sort();

    return new Date(nextDue[0]);
  }
  mapSchedule(todo: TTodoWithSchedule) {
    const schedules = todo.repeatableTodoSchedules;
    const nextDue = todo.repeatableTodoSchedules
      .reduce((acc: any, curr: any) => {
        const schedule = this.parseCronSchedule(curr.cron_schedule);
        const nextDue = schedule.next().toDate().getTime();
        acc.push(nextDue);
        return acc;
      }, new Array())
      .sort();

    return { schedules: schedules, nextDue: new Date(nextDue[0]) };
  }
  getEOD() {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(0, 0, 0, 0);
    return now;
  }
}
