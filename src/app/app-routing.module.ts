import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';
import { IndexComponent } from './pages/index/index.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductCreateComponent } from './pages/product-create/product-create.component';
import { ProductMasterDetailComponent } from './pages/product-master-detail/product-master-detail.component';
import { OcrdComponent } from './pages/ocrd/ocrd.component';
import { RendelesComponent } from './pages/rendeles/rendeles.component';
import { FRMHNComponent } from './pages/f-rmhn/f-rmhn.component';
import { OraRMHNComponent } from './pages/ora-rmhn/ora-rmhn.component';
import { GridRMHNComponent } from './pages/grid-rmhn/grid-rmhn.component';
import { OinvlistComponent } from './pages/oinvlist/oinvlist.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderComponent } from './pages/order/order.component';


const routes: Routes = [
  {
    path: "",
    component: IndexComponent
  },
  {
    path: "products",
    component: ProductComponent
  },
  {
    path: "products/create",
    component: ProductCreateComponent
  },
  {
    path: "products/:id",
    component: ProductEditComponent
  },
  {
    path: "MasterDetail/:id",
    component: ProductMasterDetailComponent
  },
  {
    path: "ocrds",
    component: OcrdComponent
  },
  {
    path: "oinvlist",
    component: OinvlistComponent
  },
  {
    path: "rmhn",
    component: FRMHNComponent
  },  
  {
    path: "rmhnrmhv",
    component: OraRMHNComponent
  }, 
  {
    path: "gridrmhn",
    component: GridRMHNComponent
  }, 
  {
    path: "rendeles",
    component: RendelesComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "shop",
    component: ShopComponent
  },
  {
    path: "myCart",
    component: CartComponent
  },
  {
    path: "order",
    component: OrderComponent
  },
  {
    path: "**",
    component: IndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
