import { Component, OnInit, RootRenderer, ViewChild } from '@angular/core';
import { CikkService } from 'src/app/services/cikk.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { Observable } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-product-master-detail',
  templateUrl: './product-master-detail.component.html',
  styleUrls: ['./product-master-detail.component.css']
})
export class ProductMasterDetailComponent implements OnInit {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;

  product: Product = new Product();
  product$: Observable<Product[]>;
  productID: number = 0;
  ind: number = 0;

  columnDefs = [
    {headerName: 'Name', field: 'name', sortable: true, filter: true, editable: true, checkboxSelection: true },
    {headerName: 'Price', field: 'price', sortable: true, filter: true, editable: true },
    {headerName: 'Desc.', field: 'description', sortable: true, filter: true, editable: true, suppressSizeToFit: true},
    {headerName: 'Gyártó', field: 'manufacturer', sortable: true, filter: true}
];

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

 list$: Observable<Product[]>=this.cikkServ.getAll();

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
      aa => this.product = aa[0]
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
              aa => {
                this.product = aa[this.ind];
                this.list$ = this.cikkServ.getByColumn("Manufacturer",this.product.manufacturer);
              }
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

  onFirstDataRendered(params) {
    console.log(params);
    params.api.sizeColumnsToFit();
  }

  onSelectionChanged() {
    console.log("selected");
    var selectedRows = this.agGrid.api.getSelectedRows();
    var selectedRowsString = "";
    selectedRows.forEach(function(selectedRow, index) {
      if (index == 0) {
        selectedRowsString = selectedRow.name + " " + selectedRow.price;
        return;
      }
    });
    alert(selectedRowsString);
  }

}
