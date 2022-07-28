import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterDetailComponent } from './product-master-detail.component';

describe('ProductMasterDetailComponent', () => {
  let component: ProductMasterDetailComponent;
  let fixture: ComponentFixture<ProductMasterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMasterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMasterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
