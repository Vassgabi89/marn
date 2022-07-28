import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OinvlistComponent } from './oinvlist.component';

describe('OinvlistComponent', () => {
  let component: OinvlistComponent;
  let fixture: ComponentFixture<OinvlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OinvlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OinvlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
