import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSettingsComponent } from './calendar-settings.component';

describe('CalendarSettingsComponent', () => {
  let component: CalendarSettingsComponent;
  let fixture: ComponentFixture<CalendarSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
