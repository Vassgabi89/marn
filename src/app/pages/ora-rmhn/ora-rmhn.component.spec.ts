import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OraRMHNComponent } from './ora-rmhn.component';

describe('OraRMHNComponent', () => {
  let component: OraRMHNComponent;
  let fixture: ComponentFixture<OraRMHNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OraRMHNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OraRMHNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
