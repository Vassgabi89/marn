import { Component, OnInit, RootRenderer, ViewChild, Input, Output, EventEmitter, OnChanges, Directive, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { Rdr1 } from 'src/app/model/rdr1';
import { OrdrService } from 'src/app/services/ordr.service';
import { Rdr1Service } from 'src/app/services/rdr1.service';
import { FormGroup, FormControl, FormBuilder, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
import { tap, switchMapTo, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MatDialog, MatGridTileHeaderCssMatStyler } from '@angular/material';
import { LovComponent } from 'src/app/modal/lov/lov.component';
import { LovParams, BaseBlock, BlokkType, FKColumns, getRow, getRows, setRow, setRows, getNewRow, RecordType, ItemEvents } from 'src/app/base/types';
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
import { Rmhn } from 'src/app/model/rmhn';
import { RmhnService } from 'src/app/services/rmhn.service';
import { RmhvService } from 'src/app/services/rmhv.service';
import { Rmhv } from 'src/app/model/rmhv';

@Component({
  selector: 'app-ora-rmhn',
  templateUrl: './ora-rmhn.component.html',
  styleUrls: ['./ora-rmhn.component.css']
})
export class OraRMHNComponent extends BaseForm implements OnInit, OnChanges, OnDestroy {

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes")
  }

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  rmhn: Rmhn = new Rmhn();
  rmhns: Rmhn[];

  rmhv: Rmhv = new Rmhv();
  rmhvs: Rmhv[];

  ordrID: number = 0;
  ind: number = 0;

  public getRowNodeId;

  public frameworkComponents: any;

  columnDefs = [
    {
      headerName: 'ID', field: 'id', sortable: true, filter: true, editable: true, resizable: true
    },
    {
      headerName: 'rmhn_id', field: 'rmhn_id', sortable: true, filter: true, editable: true, resizable: true
    },
    { headerName: 'Bevételi mód', field: 'rend_be_kod', sortable: true, filter: true, editable: true, suppressSizeToFit: true, resizable: true },
    { headerName: 'Érv. kezdete', field: 'erv_kezdete', sortable: true, filter: true, editable: true, suppressSizeToFit: true, resizable: true },
    { headerName: 'Érv. vége', field: 'erv_vege', sortable: true, filter: true, editable: true, suppressSizeToFit: true, resizable: true },
    { headerName: 'Lookup érték', field: 'rmlv_lookup_ertek', sortable: true, filter: true, editable: true, resizable: true },
    { headerName: 'Megjegyzés', field: 'megjegyzes', sortable: true, filter: true, editable: true, resizable: true },
    { headerName: 'user_created', field: 'user_created', sortable: true, filter: true, editable: true, resizable: true },
    { headerName: 'user_modified', field: 'user_modified', sortable: true, filter: true, editable: true, resizable: true },

  ];

  public gridOptions: GridOptions;

  public albums: Array<IAlbum>;
  private _subscription: Subscription;

  constructor(
    private rmhnServ: RmhnService,
    private rmhvServ: RmhvService,
    private ar: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _lightbox: Lightbox,
    private _lightboxEvent: LightboxEvent,
    private _lighboxConfig: LightboxConfig,
  ) {
    super(dialog);

    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      }

    };


    /**
     * RMHN
     */
    console.log("RMHN");
    var l_block: BaseBlock = new BaseBlock();;
    var l_fkBlock: FKColumns = new FKColumns();
    var l_type: BlokkType;

    l_block.block_name = "rmhn";
    l_block.block_type = BlokkType.multipleRow;
    l_block.getrow = <getRow>(() => { return this.rmhn });
    l_block.setrow = <setRow>((value: Rmhn) => { this.rmhn = value });
    l_block.newrow = <getNewRow>(() => { return new Rmhn });
    l_block.getrows = <getRows>(() => { return this.rmhns });
    l_block.setrows = <setRows>((value: Rmhn[]) => { this.rmhns = value });
    l_block.service = this.rmhnServ;
    l_block.columnPk = ["id"];


    l_fkBlock.blockName = "rmhv";
    l_fkBlock.fkColumns = new Map();
    l_fkBlock.fkColumns.set("id", "rmhn_id");
    l_block.DetBlocks = new Map();
    l_block.DetBlocks.set("rmhv", l_fkBlock);

    this.Blocks.set("rmhn", l_block);

    /**
     * RMHV
     */
    var l_block: BaseBlock = new BaseBlock();
    var l_fkBlock: FKColumns = new FKColumns();
    var l_type: BlokkType;

    l_block.block_name = "rmhv";
    l_block.block_type = BlokkType.Grid;

    l_block.getrow = <getRow>(() => { return this.rmhv });
    l_block.setrow = <setRow>((value: Rmhv) => { this.rmhv = value });

    l_block.newrow = <getNewRow>(() => { return new Rmhv });
    l_block.getrows = <getRows>(() => { return this.rmhvs });
    l_block.setrows = <setRows>((value: Rmhv[]) => { this.rmhvs = value });
    l_block.service = this.rmhvServ;
    l_block.columnPk = ["id"];

    l_fkBlock.blockName = "rmhn";
    l_fkBlock.fkColumns = new Map();
    l_fkBlock.fkColumns.set("rmhn_id", "id");

    l_block.MasterBlocks = new Map();
    l_block.MasterBlocks.set("rmhn", l_fkBlock);

    l_block.GridName = "#agGrid";

    this.Blocks.set("rmhv", l_block);

    this.ar.params.forEach(
      params => {
        this.ordrID = params.id;
        console.log(this.ordrID);
      }
    );

    this.getRowNodeId = function (data) {
      return data.id;
    };

    // set default config
    this._lighboxConfig.fadeDuration = 1;

    //this.domLayout = "autoHeight";
  }

  ngOnInit() {
    console.log("ONINIT")
    this.Init();
    //console.log(document.querySelector("#ordr").childNodes.forEach);
    this.Blocks.get("rmhn").DefaultWhere = "";
    console.log("REFRESH")
    this.blockRefresh("rmhn");
  }

  ngOnDestroy() { }

  public itemEvent(l_event: ItemEvents, l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any): boolean {
   
    if (l_event == ItemEvents.PostQuery) {
      console.log(l_entityname);
      console.log(l_data);
      if (l_entityname == 'rmhv') {
        if (this.getItemValue("rmhv","rend_be_kod")=="1") {
          
          
          
        } else if (!this.getItemValue("ordr","cardcode").startsWith("S")) {
          this.setRowEditable("ordr",true);
        }
      } else if (l_entityname == 'rdr1') {
        if (this.getItemValue("ordr","cardcode").startsWith("S")) {
          this.setRowEditable("rdr1",false);
          
        } else if (!this.getItemValue("ordr","cardcode").startsWith("S")) {
          this.setRowEditable("rdr1",true);
        }
      }

    }
    else if (l_event == ItemEvents.CreateRow) {
      this.setRowEditable("ordr",true);
      this.setRowEditable("rdr1",true);

    }
    return true;
  }

  public itemValidate(l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any): boolean {

    if (l_entityname == "rmhn" && l_colname === "megjegyzes") {
      

      if (l_value.toString().endsWith("*")) {
          alert("Nem végződhet *-ra");
          alert(this.getItemValue("rmhn","megjegyzes"));
          alert(this.getItemValue("rmhv","id"));
      }

    }
    else if (l_entityname == "rmhv" && l_colname === "rend_be_kod") {
      //this.setColumnEditable("ordr","cardname",false)
      //this.setColumnEditable("rdr1","itemcode",false)
        this.setItemValue("rmhn","megjegyzes",l_value);
        if (l_value=="55") {
          this.setColumnEditable("rmhn","megjegyzes",false);
          //this.setRowEditable("rmhv",false)
        } else {
          this.setColumnEditable("rmhn","megjegyzes",true);
        }

    }
    return true;
  }

  isValid(obj: any): boolean {
    return obj.valid;
  }


  onFirstDataRendered(params) {
    //console.log(params);
    //params.api.sizeColumnsToFit();
  }



  
  public a: Rmhn[];
  public l_lovParam: LovParams = new LovParams();

    public validateCell(l_name: string) {
    return <ValidatorFn>((control: FormControl) => {

      try {


        if (control.value != null) {
          if (l_name === "cardcode") {
            if ((control.value as string).endsWith("*")) {
              //this.LOV();
            }

          } else {

          }
        }
      } catch (error) {
        console.log(error);
        console.log("validateCell");
        console.log(control);

      }
      //implement a custom validation logic here.
      //the 'this' points the component instance here thanks to the arrow syntax.

      return null; //null means: no error.
    });
  }

}
