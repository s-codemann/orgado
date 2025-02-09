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
  getWeekdays() {
    return [
      { name: 'mo', number: 1 },
      { name: 'di', number: 2 },
      { name: 'mi', number: 3 },
      { name: 'do', number: 4 },
      { name: 'fr', number: 5 },
      { name: 'sa', number: 6 },
      { name: 'so', number: 0 },
    ];
  }
  getMonths() {
    return [
      { name: 'Januar', number: 0 },
      { name: 'Februar', number: 1 },
      { name: 'März', number: 2 },
      { name: 'April', number: 3 },
      { name: 'Mai', number: 4 },
      { name: 'Juni', number: 5 },
      { name: 'Juli', number: 6 },
      { name: 'August', number: 7 },
      { name: 'September', number: 8 },
      { name: 'Oktober', number: 9 },
      { name: 'November', number: 10 },
      { name: 'Dezember', number: 11 },
    ];
  }
  // getMonthsMap(value = false){
  //   jan:value
  // }
}
