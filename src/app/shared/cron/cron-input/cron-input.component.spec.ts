import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronInputComponent } from './cron-input.component';

describe('CronInputComponent', () => {
  let component: CronInputComponent;
  let fixture: ComponentFixture<CronInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
