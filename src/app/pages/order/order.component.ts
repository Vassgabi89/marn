import { Component, OnInit } from '@angular/core';
import { OitmService } from 'src/app/services/oitm.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseForm } from 'src/app/base/base-form';
import { Ordr } from 'src/app/model/ordr';
import { Rdr1 } from 'src/app/model/rdr1';
import { MatDialog } from '@angular/material';
import { OrdrService } from 'src/app/services/ordr.service';
import { Rdr1Service } from 'src/app/services/rdr1.service';
import { BaseBlock, FKColumns, BlokkType, getRow, setRow, getNewRow, getRows, setRows } from 'src/app/base/types';
import { Oitm } from 'src/app/model/oitm';
import { User } from 'src/app/model/user';
import { Domain } from 'src/app/model/domain';
import { CRD1 } from 'src/app/model/crd1';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent extends BaseForm implements OnInit {

  orderLanguage: { orderDetails: string, fullPrice: string, deliveryDate: string, finalize: string, orderComplet: string, thanks: string, close: string }

  ordr: Ordr = new Ordr();
  ordrs: Ordr[];
  rdr1: Rdr1 = new Rdr1();
  rdr1s: Rdr1[];

  megrendelok: Domain[];
  megrendelo: Domain;

  sum: number;
  address: string;
  addresses: string[];
  crd1s: CRD1[];
  form: FormGroup;
 /*  testArray: string[]; */
  cartArray: Oitm[];
  minDate = new Date();
  maxDate = new Date();
  test : Date;
  user: User;
  public l_sql: string = "";

  constructor(private oitmService: OitmService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private ordrServ: OrdrService,
    private rdr1Serv: Rdr1Service) {

    super(dialog);

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
    l_block.block_type = BlokkType.multipleRow;

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

    this.Blocks.set("rdr1", l_block);

    

  }

  async ngOnInit() {

    this.cartArray = this.oitmService.cartItems;

    console.log(this.cartArray);

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.changeLanguage(this.user.language);

    if (this.oitmService.cartItems == null) {
      this.router.navigate(['/shop']);
    }

    this.sum = this.oitmService.sum;

    this.filterDate();

    console.log("user name " + this.user.username)


    this.oitmService.getCRD1ByColumn("CardCode", this.user.lastName).toPromise().then(val => {
      //console.log("Cikkek");
      this.crd1s = val;

      console.log(val)
    });

    this.form = this.formBuilder.group({
     /*  target: [null, Validators.required], */
      amount: [this.sum],
      time: [null, Validators.required],
      name: [this.user.firstName, Validators.required],
      contact: [null, Validators.required],
      email:[this.user.username, Validators.required],
      address:[null, Validators.required],
      comment:[null, Validators.required]
    });

    //Felhozza a rendelő SAP-ba nemtett címeit
    //this.l_sql = "select ShipToCode, CardCode, Street, ZipCode, City, Country from IFSZ_WEB_CRD1_V  where CardCode = '" + this.user.lastName + "'"
   
    
    //this.megrendelok = await this.getDomainBySql(this.l_domain_sql);

    this.blockRefresh("ordr"); 

    console.log(this.megrendelok);
  }

  filterDate() {
    this.minDate = new Date(Date.now());
    let maxDate = new Date();
    maxDate.setFullYear(this.minDate.getFullYear() + 2);
    this.maxDate = maxDate;
  }

  navigate() {
    this.router.navigate(['/shop'])
  }

  async acceptOrder() {

    this.crd1s.forEach(crd1 =>{
      if(crd1.ShipToCode == this.form.value.address){
        this.address = crd1.ZipCode + ", " + crd1.City + ", " + crd1.Street;
      }
    })

    const val = await this.createRowNoVis("ordr");
    console.log("1")
    console.log(this.ordrs);
    console.log("2")
    this.test  = this.form.value.time;
    this.test.setDate(this.test.getDate()+1)
    console.log(this.test)
    this.setItemValue("ordr", "doctotal", this.sum);
    this.setItemValue("ordr", "email", this.form.value.email);
    this.setItemValue("ordr", "address", this.address);
    this.setItemValue("ordr", "comment", this.form.value.comment);
    this.setItemValue("ordr", "contact", this.form.value.contact);
    this.setItemValue("ordr", "docduedate", this.test);
    this.setItemValue("ordr", "shiptocode", this.form.value.address);
    
    

    //const val2 = await this.createRowNoVis("rdr1");

    await Promise.all(this.cartArray.map(async (item) => {
      const val2 = await this.createRowNoVis("rdr1");
      let linetotal = item.price * item.quantity;
      this.setItemValue("rdr1", "itemcode", item.itemcode);
      this.setItemValue("rdr1", "itemname", item.itemname);
      this.setItemValue("rdr1", "factor1", item.quantity);
      this.setItemValue("rdr1", "factor3", item.karton);
      this.setItemValue("rdr1", "price", item.price);
      this.setItemValue("rdr1", "linetotal", linetotal);
    }))

    console.log("Tételek");
    console.log(this.rdr1s);

    this.onSubmit();

    this.oitmService.cartItems = null;
    this.oitmService.cartStatus.next(0);


  }

  public itemValidate(l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any): boolean {
    return true;
  }
  public itemEvent(l_event: import("../../base/types").ItemEvents, l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any, l_orig_event?: any): boolean {
    return true;
  }

  changeLanguage(language: string) {
    if (language === 'HUN') {
      this.orderLanguage= { orderDetails: 'Rendelési részletek', fullPrice: 'Teljes összeg', deliveryDate: 'Szállítási dátum', finalize: 'Véglegesítés', orderComplet: 'Megrendelés véglegeítve!', thanks: 'Köszönjök a megrendelést, hamarosan felvesszük Önnel a kapcsolatot.', close: 'Bezár' }

    } else {

      this.orderLanguage= { orderDetails: 'Order details', fullPrice: 'Full price', deliveryDate: 'Delivery date', finalize: 'Finalize', orderComplet: 'Order complete!', thanks: 'Thank you for your order, we will contact you soon.', close: 'Close' }
    
    }
  }

  teszt(){

    console.log("itt vannak az adatok")
    console.log(this.form.value)
    console.log(this.ordr)
    console.log(this.ordrs)
    console.log(this.megrendelok);
  }

}
