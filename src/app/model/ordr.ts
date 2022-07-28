import { DataRecord } from '../base/types';

export class OrdrBase extends DataRecord {

    public id: number = 0;
    manualnum: string = "";
    cardcode: string = "";
    cardname: string = "";
    email: string = "";
    address: string = "";
    comment: string = "";
    contact: string = "";
    docdate: string = "";
    docduedate: string = "";
    doctotal: number = 0;
    shiptocode: string = "";

}

export class Ordr extends OrdrBase {

    old_data: OrdrBase;

}
