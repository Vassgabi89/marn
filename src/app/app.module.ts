import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailCardComponent } from './common/detail-card/detail-card.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ProductComponent } from './pages/product/product.component';
import { IndexComponent } from './pages/index/index.component';
import { NavComponent } from './common/nav/nav.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './model/user/user.component';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { ProductCreateComponent } from './pages/product-create/product-create.component';
import { ProductMasterDetailComponent } from './pages/product-master-detail/product-master-detail.component';

import { AgGridModule } from 'ag-grid-angular';
import { OcrdComponent } from './pages/ocrd/ocrd.component';
import { RendelesComponent } from './pages/rendeles/rendeles.component';
import { LovComponent } from './modal/lov/lov.component';
import { QueryLovComponent } from './modal/query-lov/query-lov.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ItemValidatorClass } from './base/ItemValidator';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { DialogDraggableTitleDirective } from './modal/dialog-draggable-title-directive.directive'
import { DateValueAccessor } from './base/date-value-accessor.directive';
import { LefurasComponent } from './base/lefuras/lefuras.component';
import { LightboxModule } from 'ngx-lightbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderComponent } from './base/loader/loader.component';
import { FRMHNComponent } from './pages/f-rmhn/f-rmhn.component';
import { OraRMHNComponent } from './pages/ora-rmhn/ora-rmhn.component';
import { GridRMHNComponent } from './pages/grid-rmhn/grid-rmhn.component';
import { OinvlistComponent } from './pages/oinvlist/oinvlist.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderComponent } from './pages/order/order.component';
import { ItemSelectorDirective } from './directives/item-selector.directive';
import { AuthenticationsService } from './services/authentications.service';
import { OitmService } from './services/oitm.service';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';
import { DatePickerComponent } from './common/date-picker/date-picker.component';
import { DiscontPeriodTableComponent } from './common/discont-period-table/discont-period-table.component';


@NgModule({
  declarations: [
    AppComponent,
    DetailCardComponent,
    FilterPipe,
    ProductComponent,
    IndexComponent,
    NavComponent,
    ProductEditComponent,
    LoginComponent,
    UserComponent,
    ProductCreateComponent,
    ProductMasterDetailComponent,
    OcrdComponent,
    RendelesComponent,
    LovComponent,
    ItemValidatorClass,
    QueryLovComponent,
    DialogDraggableTitleDirective,
    DateValueAccessor,
    LefurasComponent,
    LoaderComponent,
    FRMHNComponent,
    OraRMHNComponent,
    GridRMHNComponent,
    OinvlistComponent,
    ShopComponent,
    CartComponent,
    OrderComponent,
    ItemSelectorDirective,
    DatePickerComponent,
    DiscontPeriodTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    NoopAnimationsModule,
    MaterialModule,
    LightboxModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    AuthenticationsService,
    OitmService
  ],
  bootstrap: [AppComponent],
  entryComponents: [LovComponent, QueryLovComponent, LefurasComponent]
})
export class AppModule { }
