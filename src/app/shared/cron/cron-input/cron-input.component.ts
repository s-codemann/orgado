import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ScheduleService } from '../schedule.service';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TimepickerComponent } from '../../../core/layout/common/timepicker/timepicker.component';
import { DIALOG_SCROLL_STRATEGY } from '@angular/cdk/dialog';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cron-input',
  standalone: true,
  imports: [
    MatCheckbox,
    MatRadioModule,
    MatButton,
    MatFabButton,
    MatIcon,
    ReactiveFormsModule,
    TimepickerComponent,
    MatInput,
  ],
  templateUrl: './cron-input.component.html',
  styleUrl: './cron-input.component.scss',
  host: { '[class.stop-scroll]': 'stopScroll()' },
})
export class CronInputComponent implements OnInit {
  cronString = input<string>();
  private dref = inject(DIALOG_SCROLL_STRATEGY);

  cStringe = effect(
    () => {
      console.log('GOT CRON STRING');
      const cronString = this.cronString();
      if (cronString) {
        console.log('GOT CRON STRING', cronString);
        this.parseCronString(cronString);
        console.log('PARSED');
      }
    },
    { allowSignalWrites: true }
  );

  private scheduleService = inject(ScheduleService);
  private cd = inject(ChangeDetectorRef);
  protected readonly weekdaysData = this.scheduleService.getWeekdays();
  protected monthsData = this.scheduleService.getMonths();

  stopScroll = signal(false);

  cronForm = new FormGroup({
    daysOfMonth: new FormArray(new Array()),
    weekdays: new FormArray(new Array()),
    months: new FormArray(new Array()),
    time: new FormControl('', [Validators.required]),
    // daysOfMonthGroup: new FormGroup({ setDaysOfMonth: new FormControl() }),
    setDaysOfMonth: new FormControl('false'),
    setMonths: new FormControl('false'),
    setWeekdays: new FormControl('false'),
  });

  ngOnInit(): void {
    // this.parseCronString('13 15 1-5,7-12 1-8,10-11 1,2,4-5');
    // this.dref.
    this.cronForm.valueChanges.subscribe((v) =>
      console.log('CRON: ', v, this.cronForm)
    );

    this.cronForm.valueChanges
      .pipe(
        map((v) => v.setWeekdays),
        distinctUntilChanged()
      )
      .subscribe((v) => {
        if (v === 'true' && this.weekdays.length === 0) {
          this.addWeekdaysGroup();
        }
      });

    this.cronForm.valueChanges
      .pipe(
        map((v) => v.setMonths),
        distinctUntilChanged()
      )
      .subscribe((v) => {
        if (v === 'true' && this.months.length === 0) {
          this.addMonthsGroup();
        }
      });
    this.cronForm.valueChanges
      .pipe(
        map((v) => v.setDaysOfMonth),
        distinctUntilChanged()
      )
      .subscribe((v) => {
        if (v === 'true' && this.daysOfMonth.length === 0) {
          this.addDaysOfMonthGroup();
        }
      });
  }
  get daysOfMonth() {
    return this.cronForm.get('daysOfMonth') as FormArray;
  }
  get weekdays() {
    return this.cronForm.get('weekdays') as FormArray;
  }
  get months() {
    return this.cronForm.get('months') as FormArray;
  }
  addDaysOfMonthGroup(type: 'span' | 'single' = 'span') {
    const g = new FormGroup({
      start: new FormControl(1, Validators.min(1)),
      end: new FormControl(1, [Validators.min(1), Validators.required]),
      type: new FormControl(type),
    });
    this.daysOfMonth.push(g);
  }
  addWeekdaysGroup() {
    const weekDays = this.scheduleService.getWeekdays();
    const daysOfWeekObj = {};
    weekDays.forEach((day) => {
      Object.defineProperty(daysOfWeekObj, day.name, {
        enumerable: true,
        writable: true,
      });
      //@ts-ignore
      daysOfWeekObj[day.name as keyof daysOfWeekObj] = new FormControl(false);
    });
    this.weekdays.push(new FormGroup(daysOfWeekObj));
  }
  addMonthsGroup() {
    const months = this.monthsData;
    const monthsObj = {};
    months.forEach((month) => {
      Object.defineProperty(monthsObj, month.name, {
        enumerable: true,
        writable: true,
      });
      // @ts-ignore
      monthsObj[month.name] = new FormControl(false);
    });
    this.months.push(new FormGroup(monthsObj));
  }
  stop() {
    this.stopScroll.set(true);
  }

  parseCronString(cronString: string) {
    const parts = cronString.split(' ');
    const [minutes, hours, daysOfMonth, months, weekdays] = parts;

    this.cronForm.controls.time.setValue(hours + ':' + minutes);
    if (daysOfMonth !== '*') {
      const ranges = daysOfMonth.split(',');
      let dayOfMonthValue: any = new Object();
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        if (range.includes('-')) {
          const [dayStart, dayEnd] = range.split('-');
          dayOfMonthValue = {
            start: new FormControl(+dayStart),
            end: new FormControl(+dayEnd),
            type: new FormControl('span'),
          };
        } else
          dayOfMonthValue = {
            start: new FormControl(+range),
            end: new FormControl(+range),
            type: new FormControl('single'),
          };
        this.cronForm.controls.daysOfMonth.push(new FormGroup(dayOfMonthValue));
        this.cronForm.controls.setDaysOfMonth.setValue('true');
      }
    }

    if (weekdays !== '*') {
      const ranges = weekdays.split(',');
      let weekdaysValue = [...this.weekdaysData];
      const accumulatedSingleWeekdays = {
        mo: false,
        di: false,
        mi: false,
        do: false,
        fr: false,
        sa: false,
        so: false,
      };
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        if (range.includes('-')) {
          const [dayStart, dayEnd] = range.split('-');
          weekdaysValue = this.weekdaysData.map((wd) => {
            if (wd.number >= +dayStart && wd.number <= +dayEnd) {
              //@ts-ignore
              accumulatedSingleWeekdays[wd.name] = true;
              return { ...wd, included: true };
            } else return { ...wd, included: false };
          });
        } else {
          this.weekdaysData.forEach((wd) => {
            if (wd.number === +range) {
              //@ts-ignore
              accumulatedSingleWeekdays[wd.name] = true;
            } else {
            }
          });
        }
      }

      //@ts-ignore
      const formGroupValue: any = {};
      const val = Object.entries(accumulatedSingleWeekdays).forEach((entry) => {
        if (entry[1]) {
          formGroupValue[entry[0]] = new FormControl(true);
        } else {
          formGroupValue[entry[0]] = new FormControl(false);
        }
      });
      this.cronForm.controls.weekdays.push(new FormGroup(formGroupValue));
      this.cronForm.controls.setWeekdays.setValue('true');
    }
    if (months !== '*') {
      const parts = months.split(',');
      const accumulatedMonths: ((typeof this.monthsData)[number] & {
        included: boolean;
      })[] = [...this.monthsData.map((m) => ({ ...m, included: false }))];
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.includes('-')) {
          const [start, end] = part.split('-');
          this.monthsData.forEach((month) => {
            if (month.number + 1 >= +start && month.number + 1 <= +end) {
              const accumulatorMonth = accumulatedMonths.find(
                (m) => m.number === month.number
              )!;
              accumulatorMonth.included = true;
            }
          });
        } else {
          accumulatedMonths.find((m) => m.number + 1 === +part)!.included =
            true;
        }
      }
      let value: any = new Object();
      accumulatedMonths.forEach((m) => {
        //@ts-ignore
        value[m.name] = new FormControl(m.included);
      });

      this.months.push(new FormGroup(value));
      this.cronForm.controls.setMonths.setValue('true');
    }
  }
  toCronString(val: typeof this.cronForm.value) {
    const [valHours, valMinutes] = val.time!.split(':');
    let minutes = valMinutes;
    let hours = valHours;
    let daysOfMonth = '*';
    let months = '*';
    let weekdays = '*';

    if (val.setMonths === 'true') {
      months = '';
      const setMonths = val.months[0];
      // const accumulatedMonths
      for (const m in setMonths) {
        if (setMonths[m]) {
          const monthNum =
            this.monthsData.find((rawMonth) => rawMonth.name === m)!.number + 1;
          if (months.length > 0) {
            months += ',';
          }
          months += monthNum.toString();
        }
      }
    }
    if (val.setWeekdays === 'true') {
      weekdays = '';
      const setWeekdays = val.weekdays[0];

      for (const wd in setWeekdays) {
        const wdNum = this.weekdaysData.find((d) => d.name === wd)!.number;
        if (setWeekdays[wd]) {
          if (weekdays.length > 0) {
            weekdays += ',';
          }
          weekdays += wdNum;
        }
      }
    }
    if (val.setDaysOfMonth === 'true') {
      daysOfMonth = '';
      val.daysOfMonth.forEach((day: { start: number; end: number }) => {
        if (daysOfMonth.length > 0) {
          daysOfMonth += ',';
        }
        if (day.start === day.end) {
          daysOfMonth += day.start.toString();
        } else {
          daysOfMonth += day.start.toString() + '-' + day.end.toString();
        }
      });
    }

    const cronString = [minutes, hours, daysOfMonth, months, weekdays].join(
      ' '
    );
    console.log('CRONSTRING: ', cronString);
    return cronString;
  }
}
