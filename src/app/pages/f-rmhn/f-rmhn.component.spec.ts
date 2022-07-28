import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FRMHNComponent } from './f-rmhn.component';

describe('FRMHNComponent', () => {
  let component: FRMHNComponent;
  let fixture: ComponentFixture<FRMHNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FRMHNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FRMHNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
