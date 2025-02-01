import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { OverlayComponent } from '../../../../core/layout/common/overlay/overlay/overlay.component';
import { TimepickerComponent } from '../../../../core/layout/common/timepicker/timepicker.component';
import { TodosService } from '../../todos.service';
import { TodosStore, TTodo } from '../../todo.store';
import {
  toSignal,
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { map, distinctUntilChanged, takeUntil, filter } from 'rxjs';
import { TCreateTodoForm, TTodoForm } from '../../model/forms';
import { TWeekDay } from '../../model/weekday';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-edit-todo',
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
    OverlayComponent,
    MatIconModule,
    JsonPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-todo.component.html',
  styleUrl: './edit-todo.component.scss',
})
export class EditTodoComponent implements OnInit, AfterViewInit {
  controlsInEdit: WritableSignal<{
    [K in keyof TTodoForm]: { editable: boolean; inEdit: boolean };
  }> = signal({
    description: { editable: true, inEdit: false },
    repeatable: { editable: true, inEdit: false },
    title: { editable: true, inEdit: false },
    userId: { editable: true, inEdit: false },
  });
  dialogData = inject(MAT_DIALOG_DATA);
  todo = input<TTodo>();
  todoId: WritableSignal<number | undefined> = signal(undefined);
  todoeff = effect(() => {
    const todo = this.todo();
  });
  todoInEdit = computed(() => {
    const todoId = this.todoId();
    if (todoId) {
      return this.todosStore.entityMap()[this.dialogData.todo];
    } else return null;
  });

  setFormEffect = effect(() => {
    const todoInEdit = this.todoInEdit();
    if (todoInEdit) {
      this.editTodoForm.get('title')?.setValue(todoInEdit.title);
      this.editTodoForm.get('description')?.setValue(todoInEdit.description);
      this.editTodoForm.get('repeatable')?.setValue(todoInEdit.repeatable);
      // this.editTodoForm.disable();
    }
  });

  private todosService = inject(TodosService);
  private todosStore = inject(TodosStore);
  protected editTodoForm = this.todosService.generateEditTodoForm();
  Object = Object;

  private dateAdapter = inject(DateAdapter);
  createTodoForm: FormGroup = this.todosService.generateCreateTodoForm();
  save = output();
  protected dailyCheckbox: Signal<MatCheckbox | undefined> =
    viewChild('dailyCheckbox');
  get weekdaysSelection() {
    return this.createTodoForm.get('weekdaysForm');
  }
  private previousWeekdaysSelection: WritableSignal<any> = signal(undefined);
  protected confirmSchedule = signal(false);
  private get allWeekdaysSelectedState() {
    return {
      days: {
        di: true,
        do: true,
        fr: true,
        mi: true,
        mo: true,
        sa: true,
        so: true,
      },
      time: this.createTodoForm.get('weekdaysForm')!.value.time ?? null,
    };
  }
  private get noWeekdaysSelectedState() {
    return {
      days: {
        di: true,
        do: true,
        fr: true,
        mi: true,
        mo: true,
        sa: true,
        so: true,
      },
      time: this.createTodoForm.get('weekdaysForm')!.value.time,
    };
  }
  protected setDaily = effect(() => {
    const checkbox = this.dailyCheckbox();
    if (!checkbox) {
      return;
    }
    checkbox.change.subscribe((e) => {
      console.log('CHECKBOXCHANGE', e);
      console.log(this.createTodoForm.get('weekdaysForm')!.value);

      const checked = e.checked;
      const allSelectedState = this.allWeekdaysSelectedState;
      const noneSelectedState = {
        days: {
          di: false,
          do: false,
          fr: false,
          mi: false,
          mo: false,
          sa: false,
          so: false,
        },
        time: this.createTodoForm.get('weekdaysForm')!.value.time ?? null,
      };
      if (checked) {
        if (this.weekdaysSelection!.get('time')!.disabled) {
          this.weekdaysSelection!.get('time')!.enable();
        }
        const currentSelectedDays = this.createTodoForm
          .get('weekdaysForm')!
          .getRawValue();

        this.previousWeekdaysSelection.set(currentSelectedDays);
        this.createTodoForm
          .get('weekdaysForm')!
          .setValue(this.allWeekdaysSelectedState);
      } else if (this.previousWeekdaysSelection()) {
        this.createTodoForm
          .get('weekdaysForm')!
          .setValue(this.previousWeekdaysSelection());
      } else {
        this.createTodoForm.get('weekdaysForm')!.setValue(noneSelectedState);
      }
    });
    if (!this.dailyCheckbox()) {
      return;
    }
    if (this.dailyCheckbox()) {
      // this.dailyCheckbox().
    }
    console.log(
      'DAILYCHANGE',
      this.dailyCheckbox()?.checked,
      this.dailyCheckbox()
    );
  });
  todoRepeatable: Signal<any> = toSignal(
    this.createTodoForm.valueChanges.pipe(
      takeUntilDestroyed(),
      map((v) => v.repeatable),
      distinctUntilChanged()
    )
  );
  todoRepeatableObs = toObservable(this.todoRepeatable);
  handleOptionalRepeatable = effect(() => {
    if (this.todoRepeatable()) {
      this.addWeekdaysForm(this.createTodoForm);
    } else {
      if (this.createTodoForm.get('weekdaysForm')) {
        this.createTodoForm.removeControl('weekdaysForm');
        this.createTodoForm.removeControl('schedules');
      }
    }
  });
  ngOnInit(): void {
    console.log('DIALOG BEFOE');
    console.log('DIALOG DATA: ', this.dialogData);
    // this.dialogData;
    if (this.dialogData) {
      this.todoId.set(this.dialogData.todo);
      console.log(
        'SET TODO ID: ',
        this.dialogData.todo,
        this.todosStore.entityMap()[this.dialogData.todo]
      );
      this.todosStore.entities()[this.dialogData.todoId];
    }
    this.dateAdapter.setLocale('de');
    this.checkSavedCreateTodoFormState();
    const c = new FormArray<any>([new FormControl()]);
    c.setValue([new FormControl(2)]);
    console.log('ARRAY', c);
  }
  ngAfterViewInit(): void {
    console.log('CONTROLS', this.editTodoForm.controls);
    for (let control in this.editTodoForm.controls) {
      const current = this.editTodoForm.get(control);
    }
  }
  onSubmit() {
    console.log('VAL:', this.createTodoForm.value);
    // return;
    if (this.createTodoForm.valid) {
      const value = this.createTodoForm.value;
      // if(value.schedule)
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
          console.log('RECEIVED VALUE: ', v);
          v;
          localStorage.removeItem('create_todo_form');
          this.saveCreateTodoFormState = false;
        });
    }
  }
  saveCreateTodoFormState = true;
  dueDateDp!: MatDatepicker<HTMLInputElement>;
  showTimepicker = signal(false);
  showScheduleTimePicker = signal(false);

  get schedules() {
    return this.createTodoForm.get('schedules') as FormArray;
  }
  get scheduleTimePicker() {
    return this.createTodoForm.get('weekdaysForm');
  }
  showScheduleConfirmation() {
    this.confirmSchedule.set(true);
    console.log(
      'TIME CONTROL VALID: ',
      this.weekdaysSelection!.get('time')!.valid
    );
    if (this.weekdaysSelection?.errors) {
      setTimeout(() => {
        this.confirmSchedule.set(false);
      }, 2500);
    }
  }
  onScheduleSelected() {
    if (this.scheduleTimePicker?.value.time) {
      this.confirmSchedule.set(false);
      const scheduleControl = new FormControl(this.scheduleTimePicker!.value);
      this.schedules.push(scheduleControl);
      this.dailyCheckbox()?.writeValue(false);
      this.createTodoForm.get('weekdaysForm')?.reset();
      this.showScheduleTimePicker.set(false);
    }
  }
  oneWeekdaySelected: ValidatorFn = (control: AbstractControl) => {
    const exisingSchedules = this.createTodoForm.get('schedules') as
      | FormArray
      | undefined;
    if (exisingSchedules && exisingSchedules.length > 0) {
      return null;
    }
    const weekdaysSelection = control as FormGroup;
    const errors: ValidationErrors = new Object();

    const currentTimeVal = weekdaysSelection.get('time')!.value;
    const timeSelected = currentTimeVal !== '' && currentTimeVal !== null;
    if (!timeSelected) {
      errors['time'] = 'must select time';
    }
    const daysGroupValue = weekdaysSelection.get('days')!.value as Object;
    const daySelected = Object.values(daysGroupValue).reduce((acc, curr) => {
      if (curr === true) {
        return true;
      } else if (!acc) {
        return false;
      } else return true;
    }, false);

    if (!daySelected) {
      errors['daySelected'] = 'must select day';
    }
    if (errors['time'] || errors['daySelected']) {
      return errors;
    }

    return null;
  };

  ngOnDestroy(): void {
    if (this.saveCreateTodoFormState) {
      localStorage.setItem(
        'create_todo_form',
        JSON.stringify(this.createTodoForm.getRawValue())
      );
    }
  }
  checkSavedCreateTodoFormState() {
    const savedStateRaw = localStorage.getItem('create_todo_form');
    if (savedStateRaw) {
      const savedValue = JSON.parse(savedStateRaw);
      if (this.checkIsRepeatable(savedValue)) {
        const schedules = savedValue.schedules;
        this.createTodoForm.get('repeatable')!.setValue(true);
        this.createTodoForm.addControl(
          'schedules',
          new FormArray(
            schedules.map((s: any) => new FormControl(s)),
            [Validators.minLength(1), Validators.required]
          )
        );
        this.addWeekdaysForm(this.createTodoForm);
      }
      setTimeout(() => {
        this.createTodoForm.setValue(savedValue);
      }, 100);
    }
  }
  addWeekdaysForm(createTodoForm: typeof this.createTodoForm) {
    this.createTodoForm.addControl(
      'weekdaysForm',
      this.todosService.getWeekdaysGroup()
    );
    this.createTodoForm
      .get('weekdaysForm')!
      .addValidators(this.oneWeekdaySelected);
    this.createTodoForm.addControl(
      'schedules',
      new FormArray([], [Validators.minLength(1), Validators.required])
    );
    this.weekdaysSelection!.valueChanges.pipe(
      takeUntil(this.todoRepeatableObs.pipe(filter((v) => v === false)))
    ).subscribe((v) => {
      if (!Object.values(v.days).includes(true)) {
        this.weekdaysSelection?.get('time')?.disable({ emitEvent: false });
      } else {
        this.weekdaysSelection?.get('time')?.enable({ emitEvent: false });
      }
    });
  }
  checkIsRepeatable(createTodoFormValue: TCreateTodoForm) {
    if (createTodoFormValue.repeatable) {
      return true;
    } else return false;
  }
  removeScheduleAt(formArrayIndex: number) {
    this.schedules.removeAt(formArrayIndex);
    this.schedules.updateValueAndValidity();
    this.createTodoForm.updateValueAndValidity();
  }
  doEdit(controlName: keyof TTodoForm) {
    const current = this.controlsInEdit();
    current[controlName].inEdit = true;
    this.controlsInEdit.set(current);
  }
}
