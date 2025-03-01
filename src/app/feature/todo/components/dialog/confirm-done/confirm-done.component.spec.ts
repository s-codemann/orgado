import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDoneComponent } from './confirm-done.component';

describe('ConfirmDoneComponent', () => {
  let component: ConfirmDoneComponent;
  let fixture: ComponentFixture<ConfirmDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
