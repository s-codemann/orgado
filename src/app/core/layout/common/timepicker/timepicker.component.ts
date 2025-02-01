//@ts-nocheck
import {
  Component,
  computed,
  effect,
  input,
  Input,
  OnInit,
  Output,
  Signal,
  signal,
  WritableSignal,
  EventEmitter,
  inject,
  OnChanges,
  SimpleChanges,
  SkipSelf,
  Injector,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import {
  MatButton,
  MatFabButton,
  MatMiniFabButton,
} from '@angular/material/button';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    MatIconModule,
    MatFabButton,
    MatMiniFabButton,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TimepickerComponent,
    },
  ],
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
})
export class TimepickerComponent implements ControlValueAccessor, OnInit {
  @Output() done = new EventEmitter();
  ngOnInit() {
    const control = this._injector.get(NgControl);
    this.ngControl = control;
  }
  private _injector = inject(Injector);
  ngControl?: NgControl;

  startHours = input(new Date().getHours());
  startMins = input(new Date().getMinutes());
  width = input('100%');
  minutesStep = input(5);

  disabledSig = signal(false);
  hours = signal<number | null>(null);
  hoursStr = computed(() => this.toTimeString(this.hours()));
  minutes = signal<number | null>(null);
  minsStr = computed(() => this.toTimeString(this.minutes()));
  timeStr = computed(() => {
    if (this.hours() === null || this.minutes === null) {
      return null;
    }
    return this.hoursStr() + ':' + this.minsStr();
  });
  emitNewValue = effect(() => {
    this.onChange(this.timeStr());
  });

  onChange = (time: string | null) => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {
    console.log('TIMEPICKER DISABLED STATE: ', isDisabled);
    this.disabledSig.set(isDisabled);
  }
  writeValue(time: String | null): void {
    if (time === null) {
      this.hours.set(null);
      this.minutes.set(null);
      return;
    }
    const [hours, minutes] = time.split(':');
    if (!Number.isNaN(parseInt(hours)) && !Number.isNaN(parseInt(minutes))) {
      this.hours.set(parseInt(hours));
      this.minutes.set(parseInt(minutes));
    }
  }
  checkIsNull() {
    if (this.minutes() === null || this.hours === null) {
      this.minutes.set(this.startMins());
      this.hours.set(this.startHours());
      return true;
    }
    return false;
  }

  addMinutes() {
    if (this.checkIsNull()) return;
    if (this.disabledSig()) return;
    if (this.minutes()! + this.minutesStep() < 60) {
      this.minutes.update((curr) => curr! + this.minutesStep());
    } else {
      this.minutes.update((curr) => this.minutesStep() - (60 - curr!));
    }
  }
  decMinutes() {
    if (this.checkIsNull()) return;
    if (this.disabledSig()) return;
    if (this.minutes() > 0) {
      this.minutes.update((m) => m - 1);
    } else {
      this.minutes.set(59);
    }
  }
  addHours() {
    if (this.checkIsNull()) return;
    if (this.disabledSig()) return;
    if (this.hours() < 23) {
      this.hours.update((curr) => curr + 1);
    } else {
      this.hours.set(0);
    }
  }
  decHours() {
    if (this.checkIsNull()) return;
    if (this.disabledSig()) return;
    if (this.hours() > 0) {
      this.hours.update((h) => h - 1);
    } else {
      this.hours.set(23);
    }
  }

  toTimeString(unit: number | null) {
    if (unit === null) {
      return '--';
    }
    if (unit >= 10) {
      return unit.toString();
    } else return '0' + unit.toString();
  }
  setValue() {
    // this.onChange(this.timeStr());
    if (this.disabledSig()) return;
    this.done.emit();
  }
  setNull() {
    this.minutes.set(null);
    this.hours.set(null);
    this.onChange(null);
  }
  wheelHours(ev: WheelEvent) {
    console.log('hi scroll', ev);
    if (ev.deltaY > 0) {
      this.decHours();
    } else this.addHours();
  }
  wheelMinutes(ev: WheelEvent) {
    console.log('hi scroll', ev);
    if (ev.deltaY > 0) {
      this.decMinutes();
    } else this.addMinutes();
  }
}
