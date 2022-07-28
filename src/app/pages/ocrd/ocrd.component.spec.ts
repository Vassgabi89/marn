import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrdComponent } from './ocrd.component';

describe('OcrdComponent', () => {
  let component: OcrdComponent;
  let fixture: ComponentFixture<OcrdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
