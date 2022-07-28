import { ServiceBuilder } from 'selenium-webdriver/opera';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { GridOptions, GridApi } from 'ag-grid-community';

export class LovColDef {
    headerName: string

    field: string;
    cellClass?: string;
    /**
     * A comma separated string or array of strings containing ColumnType keys which can be used as a template for a column.
     * This helps to reduce duplication of properties when you have a lot of common column properties.
     */
    cellRendererFramework?: any;
    cellRendererParams?: any;
    
    type?: string | string[];
    /** Set to true for this column to be hidden. Naturally you might think, it would make more sense to call this field 'visible' and mark it false to hide,
     *  however we want all default values to be false and we want columns to be visible by default. */
    hide?: boolean;
    /** Initial width, in pixels, of the cell */
    width?: number;
}

export enum BlokkType {
    singleRow,
    multipleRow,
    Grid
}

export enum RecordType {
    Inserted,
    Modified,
    Original,
    Deleted,
    Empty
}

export enum ItemEvents {
    ItemValidate,
    KeyPressed,
    PostQuery,
    AfterQuery,
    AfterDml,
    CellClicked,
    CellKeyPressed,
    CreateRow
}

export enum ItemTypes {
    INPUT,
    GRID
}

export class domItems {
    entityName: string;
    colName: string;
    item: any;
    type: ItemTypes;
}

export class LovParams {
    columnDefs: LovColDef[];
    item$: any[];
    columnRet: string = "";
    service: any;
    title: string = "Értéklista";
    RowStyleRule: setRowRules;
}

export class QueryLovParams {
    columnDefs: LovColDef[];
    item$: any[];
    columnRet: string = "";
    service: any;
    observ$: Observable<any>;
    title: string = "Értéklista";
    FoundRowStyleRule: setRowRules;
    index: number;
}

export class FKColumns{
    blockName: string;
    fkColumns: Map<string,string>;
}

export declare interface getRow {
    (): object;
}

export declare interface getNewRow {
    (): object;
}

export declare interface setRow {
    (datarow: object): void;
}

export declare interface getRows {
    (): object[];
}

export declare interface setRows {
    (datarows: object[]): void;
}

export declare interface setGridRow {
    (datarow: object, index: string): void;
}

export declare interface setRowRules {
    (params: any): boolean;
}

export declare interface viewportchanged {
    (event: any, l_entityname: string): void;
}

export class BaseBlock {

    block_name: string;
    block_type: BlokkType;
    public getrow: getRow;
    public setrow: setRow;
    //private _row: object;
    getrows: getRows;
    setrows: setRows;
    setgridrow: setGridRow;
    newrow: getNewRow; 
    rowIndex: number;
    columnPk: string[];
    DetBlocks: Map<string, FKColumns>;
    MasterBlocks: Map<string, FKColumns>;
    service: any;
    agGrid: any;
    agGridApi: AgGridAngular;
    DefaultWhere: string = "";
    GridName: string ="";
    GridOption: GridOptions;

    constructor(){
        
    }
}

export class ValidationResult{
    valid: boolean = true;
    code: number = 0;
    message: string = "";
    value: any;
}

export class ServerResult{
    result: boolean = true;
    errorCode: number = 0;
    errorMessage: string = "";
}

export abstract class DataRecord{
    public record_type: RecordType;

}




