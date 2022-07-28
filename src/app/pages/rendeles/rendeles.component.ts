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



@Component({
  selector: 'app-rendeles',
  templateUrl: './rendeles.component.html',
  styleUrls: ['./rendeles.component.scss']
})
export class RendelesComponent extends BaseForm implements OnInit, OnChanges, OnDestroy {

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes")
  }

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  ordr: Ordr = new Ordr();
  ordrs: Ordr[];
  rdr1: Rdr1 = new Rdr1();
  rdr1s: Rdr1[];
  ordrID: number = 0;
  ind: number = 0;

  public getRowNodeId;

  public frameworkComponents: any;

  columnDefs = [
    {
      headerName: 'Cikk kód', field: 'itemcode', sortable: true, filter: true, editable: false, resizable: true, hide: false
      , cellRendererFramework: LefurasComponent
      , cellRendererParams: {
        lefuras: this.lefuras.bind(this),
        tipus: 'EGYEB'
      }
    },
    { headerName: 'Cikk név', field: 'itemname', sortable: true, filter: true, editable: true, suppressSizeToFit: true, resizable: true, width: 450 },
    { headerName: 'Karton menny.', field: 'factor1', sortable: true, filter: true, editable: true, resizable: true, width: 150, cellClass: "number-cell" },
    { headerName: 'Ár', field: 'price', sortable: true, filter: true, editable: true, resizable: true, width: 150, valueFormatter: this.numberFormatter, cellClass: "number-cell" },
    { headerName: 'Sor összesen', field: 'linetotal', sortable: true, filter: true, editable: false, resizable: true, width: 150, valueFormatter: this.numberFormatter, cellClass: "number-cell" },

  ];

  public gridOptions: GridOptions;

  public albums: Array<IAlbum>;
  private _subscription: Subscription;

  constructor(
    private ordrServ: OrdrService,
    private rdr1Serv: Rdr1Service,
    private ocrdServ: OcrdService,
    private oitmServ: OitmService,
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
     * ORDR
     */
    var l_block: BaseBlock = new BaseBlock();;
    var l_fkBlock: FKColumns = new FKColumns();
    var l_type: BlokkType;
    l_block.block_name = "ordr";
    l_block.block_type = BlokkType.multipleRow;
    l_block.getrow = <getRow>(() => { return this.ordr });
    l_block.setrow = <setRow>((value: Ordr) => { this.ordr = value });
    l_block.newrow = <getNewRow>(() => { return new Ordr });
    l_block.getrows = <getRows>(() => { return this.ordrs });
    l_block.setrows = <setRows>((value: Ordr[]) => { this.ordrs = value });
    l_block.service = this.ordrServ;
    l_block.columnPk = ["id"];

    l_fkBlock.blockName = "rdr1";
    l_fkBlock.fkColumns = new Map();
    l_fkBlock.fkColumns.set("id", "ordr_id");
    l_block.DetBlocks = new Map();
    l_block.DetBlocks.set("rdr1", l_fkBlock);

    this.Blocks.set("ordr", l_block);

    /**
     * RDR1
     */
    var l_block: BaseBlock = new BaseBlock();
    var l_fkBlock: FKColumns = new FKColumns();
    var l_type: BlokkType;
    l_block.block_name = "rdr1";
    l_block.block_type = BlokkType.Grid;

    l_block.getrow = <getRow>(() => { return this.rdr1 });
    l_block.setrow = <setRow>((value: Rdr1) => { this.rdr1 = value });

    l_block.newrow = <getNewRow>(() => { return new Rdr1 });
    l_block.getrows = <getRows>(() => { return this.rdr1s });
    l_block.setrows = <setRows>((value: Rdr1[]) => { this.rdr1s = value });
    l_block.service = this.rdr1Serv;
    l_block.columnPk = ["id"];

    l_fkBlock.blockName = "ordr";
    l_fkBlock.fkColumns = new Map();
    l_fkBlock.fkColumns.set("ordr_id", "id");

    l_block.MasterBlocks = new Map();
    l_block.MasterBlocks.set("ordr", l_fkBlock);

    l_block.GridName = "#agGrid";
    l_block.agGridApi = this.agGrid;

    this.Blocks.set("rdr1", l_block);

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

    const { observables, proxy } = observe(this as RendelesComponent);
    observables.ngOnInit.pipe(
      switchMapTo(observables.name),
      debounceTime(100),
      distinctUntilChanged(),
      takeUntil(observables.ngOnDestroy)
    ).subscribe(value => console.log(value));
    return proxy;
  }

  ngOnInit() {
    
    this.Blocks.get("ordr").setgridrow = <setGridRow>((value: Rdr1, index: string) => { this.agGrid.api.getRowNode(index).setData(value) });
    this.Init();
    //console.log(document.querySelector("#ordr").childNodes.forEach);
    this.Blocks.get("ordr").DefaultWhere = "";
    this.blockRefresh("ordr");

    console.log("ONINIT")
    console.log(this.ordr);
  }

  ngOnDestroy() { }

  public itemEvent(l_event: ItemEvents, l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any): boolean {
   
    if (l_event == ItemEvents.PostQuery) {
      //console.log(l_entityname);
      //console.log(l_data);
      

      if (l_entityname == 'ordr') {
        //this.setRowEditable("ordr",false);
        if (this.getItemValue("ordr","tipus")=='S') {
          this.setRowEditable("ordr",false);
        } else
        {
          this.setRowEditable("ordr",true);
        }
        this.setColumnEditable("ordr","cardcode",false);
        this.setColumnEditable("ordr","cardname",false);
        this.setColumnEditable("ordr","manualnum",false);
        this.setColumnEditable("ordr","docdate",false);
        this.setColumnEditable("ordr","doctotal",false);
      } else if (l_entityname == 'rdr1') 
      {
        //console.log(this.Blocks.get("rdr1").getrow());
        //console.log(this.getItemValue("rdr1","tipus"));

        if (this.getItemValue("rdr1","tipus")=='S') {
          this.setRowEditable("rdr1",false);
        } else
        {
          this.setRowEditable("rdr1",true);
          this.setColumnEditable("rdr1","itemcode",false);
          this.setColumnEditable("rdr1","price",false);
          this.setColumnEditable("rdr1","linetotal",false);
        }

      }

    }
    else if (l_event == ItemEvents.CreateRow) {
      this.setRowEditable("ordr",true);
      this.setRowEditable("rdr1",true);
      this.setColumnEditable("ordr","cardcode",false);
        this.setColumnEditable("ordr","cardname",false);
        this.setColumnEditable("ordr","manualnum",false);
        this.setColumnEditable("ordr","docdate",false);
        this.setColumnEditable("ordr","doctotal",false);

    }
    return true;
  }

  public itemValidate(l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any): boolean {

    //Observable observe teszt: ki kell majd kommentezni
    //this.name = l_value;
    //this.setItemValue("ordr","doctotal",1000);
    if (l_entityname == "rdr1" && l_colname === "itemname") {
      

      this.CikkLOV(l_data.id,l_value)
      this.agGrid.api.stopEditing();
      /*if (l_value.toString().endsWith("*")) {
        this.CikkLOV(l_data.id)
        this.agGrid.api.stopEditing();
      }*/

    }
    else if (l_entityname == "rdr1" && l_colname === "quantity") {
      this.docTotalSzamitas();
    }
    else if (l_entityname == "ordr" && l_colname === "cardcode") {
      //this.setColumnEditable("ordr","cardname",false)
      //this.setColumnEditable("rdr1","itemcode",false)
      if (l_value.toString().endsWith("*")) {
        this.LOV();
        return true;
      }

    }
    return true;
  }

  open(index: number): void {
    this._subscription = this._lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
    //console.log("OPEN1");
    // override the default config
    this._lightbox.open(this.albums, index);

    //console.log("OPEN2");
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      // event CLOSED is fired
      this._subscription.unsubscribe();
    }

    if (event.id === LIGHTBOX_EVENT.OPEN) {
      // event OPEN is fired
    }

    if (event.id === LIGHTBOX_EVENT.CHANGE_PAGE) {
      // event change page is fired
    }
  }

  public src = "";
  public caption = "";
  public thumb = '';
  public album = {
    src: "",
    caption: "",
    thumb: ""
  };

  lefuras(event: any): void {
    this.albums = [];
    console.log(event);
    this.src = 'assets/img/' + event.value + '.png';
    this.caption = event.rowData.itemname;
    this.thumb = '';
    this.album = {
      src: this.src,
      caption: this.caption,
      thumb: this.thumb
    };
    //console.log(this.album);
    this.albums.push(this.album);
    this.open(0);
  }

  isValid(obj: any): boolean {
    return obj.valid;
  }


  onFirstDataRendered(params) {
    //console.log(params);
    //params.api.sizeColumnsToFit();
  }


  public a: Ocrd[];
  public l_lovParam: LovParams = new LovParams();

  LOV(): void {

    //this.rdr1$.subscribe(val => {this.a = val;}).unsubscribe;
    //this.rdr1$.toPromise().then(val => {this.a = val;}).finally();

    this.ocrdServ.getAll().toPromise().then(val => {
      this.a = val;

      this.l_lovParam.columnDefs = [
        {
          headerName: 'Partner kód', field: 'cardcode', width: 100
          , cellRendererFramework: LefurasComponent
          , cellRendererParams: {
            tipus: 'VEVO'
          }
        },
        { headerName: 'Partner név', field: 'cardname', width: 200 },
        { headerName: 'Város.', field: 'city', width: 100 },
        { headerName: 'Cím', field: 'address', width: 150 },

      ];
      this.l_lovParam.title = "Partner értéklista";
      this.l_lovParam.columnRet = "cardcode";
      this.l_lovParam.item$ = this.a;
      this.l_lovParam.service = this.rdr1Serv;

      //console.log(this.l_lovParam.item$);

      const dialogRef = this.dialog.open(LovComponent, {
        width: '950',
        data: this.l_lovParam
      }
      );

      dialogRef.afterClosed().subscribe(result => {
        //this.animal = result;
        if (result) {
          this.ocrdServ.getByColumn("cardcode", result).forEach(res => {
            this.ordr.cardcode = result;
            this.ordr.cardname = res[0].cardname;
          })
        }

      });
    });
  }

  public l_cikkek: any[];

  CikkLOV(l_row_id: string, l_cikk_nev: string): void {
    var l_cardcode = this.getItemValue("ordr","cardcode")
    var l_sql = ""
    //this.rdr1$.subscribe(val => {this.a = val;}).unsubscribe;
    //this.rdr1$.toPromise().then(val => {this.a = val;}).finally();
    
    if (l_cikk_nev == "") {
      l_sql = "select itemcode, itemname, price, onhand from IFSZ_WEB_CIKK_LOV_V where cardcode = '" + l_cardcode + "'"
    }
    else {
      l_sql = "select itemcode, itemname, price, onhand from IFSZ_WEB_CIKK_LOV_V where cardcode = '" + l_cardcode + "' and itemname like '%" + l_cikk_nev + "%'"
    }
    this.oitmServ.getBySelect(l_sql).toPromise().then(val => {
      //console.log("Cikkek");
      this.l_cikkek = val;
      //console.log(this.l_cikkek);

      this.l_lovParam.columnDefs = [
        {
          headerName: 'Cikkkód', field: 'itemcode', width: 100
          , cellRendererFramework: LefurasComponent
          , cellRendererParams: {
            lefuras: this.lefuras.bind(this),
            tipus: 'EGYEB'
          }
        },
        { headerName: 'Cikknév', field: 'itemname', width: 200 },
        { headerName: 'Készlet', field: 'onhand', width: 80, cellClass: "number-cell" },
        { headerName: 'Egységár', field: 'price', width: 80, cellClass: "number-cell" },
      ];

      this.l_lovParam.title = "Cikk értéklista"
      this.l_lovParam.columnRet = "itemcode";
      this.l_lovParam.item$ = this.l_cikkek;
      this.l_lovParam.service = this.oitmServ;
      this.l_lovParam.RowStyleRule = function (params) {
        if (Number(String(params.node.data["onhand"]).replace(",", ".")) > 10) {
          return true;
        }
      };

      //console.log(this.l_lovParam.item$);

      const dialogRef = this.dialog.open(LovComponent, {
        width: '650',
        data: this.l_lovParam
      }
      );

      dialogRef.afterClosed().subscribe(result => {
        //this.animal = result;
        if (result) {
          this.oitmServ.getByColumn("itemcode", result).forEach(res => {
            var l_rdr1: Rdr1 = new Rdr1();
            l_rdr1 = this.agGrid.api.getRowNode(l_row_id).data
            l_rdr1.itemcode = result;
            l_rdr1.itemname = res[0].itemname;
            l_rdr1.quantity = 10;
            this.setItemValue("rdr1","itemcode",result);
            this.setItemValue("rdr1","itemname",res[0].itemname);
            this.setItemValue("rdr1","quantity",1);
            this.setItemValue("rdr1","price",res[0].price);
            this.setItemValue("rdr1","linetotal",res[0].price);
            this.docTotalSzamitas();
            
            //this.setItemValue2("rdr1","quantity",10, this.agGrid);
            //this.setItemValue("rdr1","itemcode",result);
            //console.log(res[0].itemname);
            //this.agGrid.api.getRowNode(l_row_id).setData(l_rdr1);
          })
        }

      });
    });
  }
  public docTotalSzamitas() {
    var l_doctotal = 0;
    console.log(this.rdr1s);
    this.rdr1s.forEach(element => {
      l_doctotal = l_doctotal + (element as Rdr1).price*(element as Rdr1).quantity;
    });
    this.setItemValue("ordr", "doctotal", l_doctotal);
  }

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
  public ujBizonylat() {
    this.blockClear("ordr");
    this.createRow("ordr");
    //this.ordrs = null;
    
    //this.itemEvent(ItemEvents.CreateRow,"ORDR","","")
  }

  public keresMod() {

    this.blockRefresh("ordr");
    this.delay(1000).then(any =>
    this.QueryLOV("ordr"));
    
  }

  public teszt(event){
    console.log(event)
  }

  public ujSor() {

    this.createRow("rdr1")
    
  }

  public sorTorles() {

    if (this.getItemValue("ordr","record_type") == RecordType.Inserted) {
      this.deleteGridRecord("rdr1","1");  
      this.docTotalSzamitas();
    } else
    {
      alert("Csak újonnan felvitt bizonylatból lehet törölni!")
    }
    
    
  }
  deleteGridRecord(arg0: string, arg1: string) {
    throw new Error("Method not implemented.");
  }

  teszt1(){

    console.log(this.ordr)
    console.log(this.rdr1)
    console.log(this.ordrs)
    console.log(this.rdr1s)
  }
}
