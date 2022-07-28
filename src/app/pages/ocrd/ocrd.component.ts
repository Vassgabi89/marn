import { Component, OnInit, RootRenderer, ViewChild } from '@angular/core';
import { OcrdService } from 'src/app/services/ocrd.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ocrd } from 'src/app/model/ocrd';
import { Observable } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-ocrd',
  templateUrl: './ocrd.component.html',
  styleUrls: ['./ocrd.component.css']
})
export class OcrdComponent implements OnInit {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;

  ocrd: Ocrd = new Ocrd();
  ocrd$: Observable<Ocrd[]>;
  ocrdID: string = "";
  ind: number = 0;

  columnDefs = [
    {headerName: 'Bizonylatszám', field: 'manualnum', sortable: true, filter: true, editable: false },
    {headerName: 'Rendelés dátuma', field: 'docdate', sortable: true, filter: true, editable: false },
    {headerName: 'Szállítási dátum', field: 'docdate', sortable: true, filter: true, editable: false },
    {headerName: 'Netto összesen', field: 'netto_total', sortable: true, filter: true}
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

 list$: Observable<Ocrd[]> = this.ocrdServ.getAll();

 constructor(
  private ocrdServ: OcrdService,
  private ar: ActivatedRoute,
  private router: Router,
) {
  console.log("KONSTRUKTOR");  
}

  ngOnInit() {
    //this.product$ = this.cikkServ.getID(this.productID);
    //this.ocrd$ = this.ocrdServ.getAll();   
    //this.list$ =this.ocrdServ.getAll();
    this.list$.forEach(a => {
      console.log(a);
    });

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
        selectedRowsString = selectedRow.cardcode + " " + selectedRow.cardname;
        return;
      }
    });
    alert(selectedRowsString);
  }

}
