export interface Iservice<T> {

    apiUrl: string;
    apiMainUrl: string;
    
    getAll(): Promise<T[]>;
    
    getAllByWhere(l_where: string): Promise<T[]>;

    getID(id: string | number): Promise<T[]>;
    
    getByColumn(col: string, value: string): Promise<T[]>;
    
    getNewRow(): Promise<T>
    
    update(value: T): Promise<any>;
    
    insert(value: T): Promise<any>;
    
    validate(col: string, value: string, entity: any): Promise<any>;
    
    updateMain(data: any[][]): Promise<any>;
      
    insertMain(data: any[][]): Promise<any>;
}
