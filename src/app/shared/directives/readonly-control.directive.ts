import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { TTodoForm } from '../../feature/todo/model/forms';

@Directive({
  selector: '[appReadonlyControl]',
  standalone: true,
})
export class ReadonlyControlDirective implements AfterViewInit {
  appReadonlyControl: InputSignal<{
    [key in keyof TTodoForm]: { editable: boolean; inEdit: boolean };
  }> = input.required();
  constructor() {}
  element: ElementRef<HTMLInputElement | HTMLTextAreaElement> =
    inject(ElementRef);
  control = inject(NgControl);

  readonlyEffect = effect(() => {
    const val = this.appReadonlyControl();
    console.log('NEW READONLY DATA', val);
    if (val) {
      const controlData =
        this.appReadonlyControl()[this.control!.name as keyof typeof val];
      const el = this.element.nativeElement;
      if (controlData.editable && controlData.inEdit) {
        el.removeAttribute('readonly');
      } else {
        this.element.nativeElement.setAttribute('readonly', 'true');
      }
    }
  });

  ngAfterViewInit(): void {
    console.log(
      'directive EL: ',
      this.element,
      this.control,
      this.appReadonlyControl()
    );
  }
}
