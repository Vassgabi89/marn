import { DataRecord } from '../base/types';

export class RmhnBase extends DataRecord {

    public id: number = 0;
    rendmod_hivnev: string = "";
    megjegyzes: string = "";
    user_created: string = "";
    user_modified: string = "";
    date_created: string = "";
    date_modified: string = "";

}

export class Rmhn extends RmhnBase {

    old_data: RmhnBase;

}

