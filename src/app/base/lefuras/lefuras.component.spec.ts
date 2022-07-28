import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LefurasComponent } from './lefuras.component';

describe('LefurasComponent', () => {
  let component: LefurasComponent;
  let fixture: ComponentFixture<LefurasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LefurasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LefurasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
