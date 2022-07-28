import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryLovComponent } from './query-lov.component';

describe('QueryLovComponent', () => {
  let component: QueryLovComponent;
  let fixture: ComponentFixture<QueryLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
