import { Component, OnInit, Inject, ViewChild, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Rdr1 } from 'src/app/model/rdr1';
import { AgGridAngular } from 'ag-grid-angular';
import { LovParams, QueryLovParams } from 'src/app/base/types';
import { Color } from 'ag-grid-community';

@Component({
  selector: 'app-query-lov',
  templateUrl: './query-lov.component.html',
  styleUrls: ['./query-lov.component.css']
})
export class QueryLovComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  defaultColDef = {
    editable: false,
    filter: true,
    sortable: true,
    resizable: true
  };

  public newRecord = new EventEmitter();
  public rowClassRules;

  constructor(
    public dialogRef: MatDialogRef<QueryLovComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueryLovParams) {
    this.l_back_col = data.columnRet;

    this.rowClassRules = {
      "record-found": data.FoundRowStyleRule,
      "default": ""
    }
  }



  rdr1$: Observable<Rdr1[]>

  onGridReady(l_event: any) {
    /*
    this.agGrid.gridOptions.getRowStyle = function(params) {
      if (params.node.rowIndex % 2 === 0) {
          return { background: 'red' }
      }
  }*/
  }

  public simpleObservable = new Observable((observer) => {

    // observable execution
    observer.next("bla bla bla")
    observer.complete()
  })

  public l_lov_data: LovParams = new LovParams();

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  private l_value: string = "";
  public l_back_col: string = "id";

  onSelectionChanged(l_vent: any) {
    var selectedRows = this.agGrid.api.getSelectedRows();
    var selectedRowsString = "";
    var p_back_col = this.l_back_col;
    var p_value: any;
    selectedRows.forEach(function (selectedRow, index) {
      if (index == 0) {
        p_value = selectedRow;
      }
    });
    this.newRecord.emit(p_value);

    //this.l_value = p_value;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getBackValue(): string {


    return this.l_value;
  }

  ngOnInit() {

  }

  teszt() {
    this.newRecord.emit("Teszt");
  }



}
