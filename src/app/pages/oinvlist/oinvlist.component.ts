import { Component, OnInit, RootRenderer, ViewChild, Input, Output, EventEmitter, OnChanges, Directive, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { Ordr } from 'src/app/model/ordr';
import { Rdr1 } from 'src/app/model/rdr1';
import { OrdrService } from 'src/app/services/ordr.service';
import { Rdr1Service } from 'src/app/services/rdr1.service';
import { FormGroup, FormControl, FormBuilder, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
import { tap, switchMapTo, debounceTime, distinctUntilChanged, takeUntil, window } from 'rxjs/operators';
import { MatDialog, MatGridTileHeaderCssMatStyler } from '@angular/material';
import { LovComponent } from 'src/app/modal/lov/lov.component';
import { LovParams, BaseBlock, BlokkType, FKColumns, getRow, getRows, setRow, setRows, getNewRow, RecordType, ItemEvents, setGridRow } from 'src/app/base/types';
import { OcrdService } from 'src/app/services/ocrd.service';
import { Ocrd } from 'src/app/model/ocrd';
import { OitmService } from 'src/app/services/oitm.service';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { BaseForm } from 'src/app/base/base-form';
import { Iservice } from 'src/app/base/iservice';
import { LefurasComponent } from 'src/app/base/lefuras/lefuras.component';
import { GridOptions } from 'ag-grid-community';
import { Lightbox, LightboxEvent, LightboxConfig, IAlbum, IEvent, LIGHTBOX_EVENT } from 'ngx-lightbox';
import { observe } from 'rxjs-observe';
import { stringify } from 'querystring';
import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { OinvService } from 'src/app/services/oinv.service';
import { Oinv } from 'src/app/model/oinv';
import { NumberFormatStyle } from '@angular/common';



@Component({
  selector: 'app-oinvlist',
  templateUrl: './oinvlist.component.html',
  styleUrls: ['./oinvlist.component.css']
})
export class OinvlistComponent extends BaseForm implements OnInit, OnChanges, OnDestroy {
  dateFormatter: any;

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes")
  }

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  oinv: Oinv = new Oinv();
  oinvs: Oinv[];
  oinvID: number = 0;
  ind: number = 0;

  public rowClassRules;

  public getRowNodeId;

  public frameworkComponents: any;

  columnDefs = [
    {headerName: 'Bizonylatszám', field: 'manualnum', sortable: true, filter: true, editable: false },
    {headerName: 'Dátum', field: 'docdate', sortable: true, filter: true, editable: false, valueFormatter: this.dateFormatter},
    {headerName: 'Netto összesen', field: 'nettototal', sortable: true, filter: true, editable: false, valueFormatter: this.numberFormatter, cellClass: "number-cell"},
    {headerName: 'Fizetett', field: 'paidtodate', sortable: true, filter: true, editable: false, valueFormatter: this.numberFormatter, cellClass: "number-cell"}
];

  public gridOptions: GridOptions;

  constructor(
    private oinvServ: OinvService,
    private ar: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {
    super(dialog);

    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      }



    };

    this.rowClassRules = {
      "attention": function(params) {
        //console.log(params.data.nettototal);
        //console.log(params.data);
        var numSickDays = params.data.nettototal-params.data.paidtodate;
        return numSickDays != 0;
      },
      "default": ""
    };
    /**
     * ORDR
     */
    var l_block: BaseBlock = new BaseBlock();;
    var l_fkBlock: FKColumns = new FKColumns();
    var l_type: BlokkType;
    l_block.block_name = "oinv";
    l_block.block_type = BlokkType.multipleRow;
    l_block.getrow = <getRow>(() => { return this.oinv });
    l_block.setrow = <setRow>((value: Oinv) => { this.oinv = value });
    l_block.newrow = <getNewRow>(() => { return new Oinv });
    l_block.getrows = <getRows>(() => { return this.oinvs });
    l_block.setrows = <setRows>((value: Oinv[]) => { this.oinvs = value });
    l_block.service = this.oinvServ;
    l_block.columnPk = ["id"];

    l_block.GridName = "#agGrid";
    l_block.agGridApi = this.agGrid;

    this.Blocks.set("oinv", l_block);

    this.ar.params.forEach(
      params => {
        this.oinvID = params.id;
        console.log(this.oinvID);
      }
    );

    this.getRowNodeId = function (data) {
      return data.id;
    };


  }

  ngOnDestroy() { }

  ngOnInit() {
    //alert("teszt")
    console.log("ONINIT")
    //this.Blocks.get("oinv").setgridrow = <setGridRow>((value: Rdr1, index: string) => { this.agGrid.api.getRowNode(index).setData(value) });
    this.Init();
    //console.log(document.querySelector("#ordr").childNodes.forEach);
    this.Blocks.get("oinv").DefaultWhere = "";
    this.blockRefresh("oinv");

  }


  public itemEvent(l_event: ItemEvents, l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any): boolean {
    return true;
  }

  public itemValidate(l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any): boolean {
    return true;
  }

}
