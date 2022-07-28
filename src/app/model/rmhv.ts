import { DataRecord } from '../base/types';

export class RmhvBase extends DataRecord {

    public id: number = 0;
    rend_be_kod: string = "";
    erv_kezdete: string = "";
    erv_vege: string = "";
    megjegyzes: string = "";
    user_created: string = "";
    user_modified: string = "";
    date_created: string = "";
    date_modified: string = "";
    rmlv_lookup_ertek: string = "";

}

export class Rmhv extends RmhvBase {

    old_data: RmhvBase;

}

