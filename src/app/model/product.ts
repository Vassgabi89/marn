export class Product {
    id: number = 0;
    private p_name?: string = "";
    price: number = 0;
    description?: string = "";
    itemCode: string = "";
    manufacturer: string = "";

    get name(): string {
        return "teszt";
    }
    set name(_name: string) {
        let reg: RegExp = /^[a-zA-Z \-\.]{3,20}$/;
        if (typeof _name === 'string' && reg.test(name)) {
            this.p_name = _name;
        } else {
            this.p_name = 'x';
        }
    }
}
