import { DataRecord } from '../base/types';

export class Rdr1Base extends DataRecord {

    id: number = 0;
    ordr_id: number = 0;
    itemcode: string = "";
    itemname: string = "";
    quantity: number = 0;
    price: number = 0;
    linetotal: number = 0;
    tipus: string ="";
    factor1: number = 0;
    factor2: number = 0;
    factor3: number = 0;
    factor4: number = 0;
    

}

export class Rdr1 extends Rdr1Base {

    old_data: Rdr1Base;
}