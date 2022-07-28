import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscontPeriodTableComponent } from './discont-period-table.component';

describe('DiscontPeriodTableComponent', () => {
  let component: DiscontPeriodTableComponent;
  let fixture: ComponentFixture<DiscontPeriodTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscontPeriodTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscontPeriodTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
