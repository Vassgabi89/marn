import { DataRecord } from '../base/types';

export class OinvBase extends DataRecord {

    public id: number = 0;
    manualnum: string = "";
    cardcode: string = "";
    cardname: string = "";
    docdate: string = "";
    docduedate: string = "";
    doctotal: number = 0;
    paidtodate: number = 0;

}

export class Oinv extends OinvBase {

    old_data: OinvBase;

}
