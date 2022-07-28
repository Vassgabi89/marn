import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp, AgRendererComponent,  } from 'ag-grid-angular/main';
import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/typings/scroll/scroll-strategy';

@Component({
  selector: 'app-lefuras',
  template:`<span><img (click)="this.lefuras($event)" src="assets/lefuras_be.png" style="width: 20px; padding-right: 4px;"/>{{params.value}}</span>` ,
  styleUrls: ['./lefuras.component.css']
})
export class LefurasComponent implements ICellRendererAngularComp {

  public params: import("ag-grid-community").ICellRendererParams;

  refresh(params: any): boolean {
    return true;
  } 

  agInit(params: import("ag-grid-community").ICellRendererParams): void {
    this.params = params;
  }


  afterGuiAttached?(params?: import("ag-grid-community").IAfterGuiAttachedParams): void {
    console.log("afterGuiAttached");
    console.log(params);

  }

  public lefuras2():any {
    var flag = "<img border='0' width='15' height='10' style='margin-bottom: 2px' src='http://www.ag-grid.com/images/flags/es" + ".png'>";
    return flag + " " + this.params.value;
}

public lefuras(event: any):any {
  if (this.params["lefuras"] instanceof Function) {
    const params = {
      event: event,
      rowData: this.params.node.data,
      value: this.params.value
      
      // ...something
    }
    this.params["lefuras"](params);
    return;
  }
  if (this.params["tipus"]=="VEVO") {
    alert("VEVŐ");  
  }
  
  /*if (this.params instanceof Function) {
    // put anything into params u want pass into parents component
    const params = {
      event: $event,
      rowData: this.params.node.data
      // ...something
    }
    this.params.onClick(params);

  }*/
}


  constructor() { }

  
}
