import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridRMHNComponent } from './grid-rmhn.component';

describe('GridRMHNComponent', () => {
  let component: GridRMHNComponent;
  let fixture: ComponentFixture<GridRMHNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridRMHNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRMHNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
