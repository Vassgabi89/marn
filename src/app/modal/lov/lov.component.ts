import { Component, OnInit, Inject, ViewChild, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Observable } from 'rxjs';
import { Rdr1 } from 'src/app/model/rdr1';
import { AgGridAngular } from 'ag-grid-angular';
import { LovParams } from 'src/app/base/types';
import { LefurasComponent } from 'src/app/base/lefuras/lefuras.component';

@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.css']
})
export class LovComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  defaultColDef = {
    editable: false,
    filter: true,
    sortable: true,
    resizable: true
  };

  public rowClassRules;

  constructor(
    public dialogRef: MatDialogRef<LovComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LovParams) {
      this.l_back_col = data.columnRet;
      
      this.rowClassRules = {
        "akcio-kiemelt": data.RowStyleRule,
        "default": ""
      }

    }
    
    rdr1$: Observable<Rdr1[]>
    
    public l_lov_data: LovParams = new LovParams();
     
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(l_event: any) {
    this.agGrid.gridOptions.getRowStyle = function(params) {
     //console.log("GETROWSTYLE");
  }
  }

  private l_value: string = "";
  public l_back_col: string = "id";

  onSelectionChanged(l_event: any) {    
    var selectedRows = this.agGrid.api.getSelectedRows();
    var selectedRowsString = "";
    var p_back_col = this.l_back_col;
    var p_value: any;
    selectedRows.forEach(function (selectedRow, index) {
      if (index == 0) {
        p_value = selectedRow[p_back_col];
      }
    });
    this.l_value = p_value;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getBackValue(): string {
    

    return this.l_value;
  }

  ngOnInit() {

  }

}
