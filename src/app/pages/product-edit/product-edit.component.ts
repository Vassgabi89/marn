import { Component, OnInit, RootRenderer } from '@angular/core';
import { CikkService } from 'src/app/services/cikk.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  product: Product = new Product();
  product$: Observable<Product[]>;
  productID: number = 0;
  ind: number = 0;

 /* constructor(
    private cikkServ: CikkService,
    private ar: ActivatedRoute,
  ) {
    this.ar.params.forEach(
      params => {
        this.cikkServ.getID(params.id).forEach(
          products => {
            this.product = products[0];
          }
        );
      }
    )
  }
  */

 constructor(
  private cikkServ: CikkService,
  private ar: ActivatedRoute,
  private router: Router,
) {
  this.ar.params.forEach(
    params => { 
      this.productID = params.id;
      console.log(this.productID);      
    }
  );  
}

  ngOnInit() {
    //this.product$ = this.cikkServ.getID(this.productID);
    this.product$ = this.cikkServ.getAll();
    this.product$.forEach(
      aa => this.product = aa[2]
    )         
  }

  findeID(element, array) {
    console.log(element);
    for (var k in array) {
      console.log(k); // prints indexes: 0, 1, 2, 3
      if (array[k]["id"]==element["id"]) {
        return k;
      }
      return -1;
    
    }
    
  }

  nextClick() {

    this.product$.forEach(
      aa => {
        console.log("NEXT");
        for (var k in aa) {
          //console.log(aa[k].id, this.product.id);
          if (aa[k].id==this.product.id) {
            //console.log("TALÁLAT");            
            this.ind = Number(k)+1;
          }        

        }
      }).then(a=> 
        {
            //console.log("VÉGE");
            this.product$.forEach(
              aa => this.product = aa[this.ind]
            )
        }
      );
      
      //this.product = this.product$[this.ind];
  }

  /*onSubmit(): void {
    this.cikkServ.update(this.product).forEach(
      response => {
        console.log(response);
        alert(`Üzenet: ${response.message}`);
        this.router.navigateByUrl("/products");
      }
    )
  }
  */

  onSubmit(): void {
    this.cikkServ.update(this.product).toPromise().then(
      response => {
        console.log(response);
        //alert(`Üzenet: ${response.message}`);
        this.router.navigateByUrl("/products");
      },
      err => {
        console.error(err);
        alert("Hiba a kommunikációban");
      }
    )
  }

  isValid(obj: any): boolean {
    return obj.valid;
  }

}
