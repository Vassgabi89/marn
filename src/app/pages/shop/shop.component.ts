import { Component, OnInit, ElementRef, ViewChild, QueryList } from '@angular/core';
import { OitmService } from 'src/app/services/oitm.service';
import { Oitm } from 'src/app/model/oitm';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/model/user';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  shopLanguage: {
    search: string, productSearch: string, packagingUnit: string, minOrderQuantity: string,
    price: string, next: string, previous: string, karton: string, packages: string, pallet: string,
    package: string, netPrice: string, cartons: string, close: string, wrongQuantity: string,
    wrongQntDesc: string
  }

  itemNumber: number = 9;


  testCounter: number = 0; // ki kell venni
  teszt: any[][];
  productArray: Oitm[];
  filteredProductArray: Oitm[];
  filteredForVevokod: Oitm[];
  prevFilterdProductArray: Oitm[];
  gasztroRetailArray: Oitm[];
  private _searchTerm: string;
  private _isGasztro: string;
  private _isRetail: string;
  // ez is string lesz, ha már eddig így használták..
  private _isProjekt: string;
  form: FormGroup;
  cartArray: Oitm[];
  startIndex: number;
  lastIndex: number;
  buttons: number[];
  prevButton: number = 1;
  prevButtonIndex: number = 0;
  itemsInCart: number = 1;
  position: number;
  prevItemIndex: string = "";
  inputQuantity: number = 1;
  quantityPlaceholder: string = '1';
  user: User;
  activeCardIndex: number;
  isWrongQuantity: boolean = false;
  counter: number = 0;
  splitStringArray: string[];
  priceByDiscountPeriod: boolean = false


  //private toastr: ToastrService,

  constructor(private oitmService: OitmService, private router: Router, private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.changeLanguage(this.user.language);

    this.startIndex = 0;
    this.lastIndex = 9;
    this.buttons = [1, 2, 3, 4, 5];

    this.listAllOitm();

    if (this.oitmService.cartItems != null) {
      this.cartArray = this.oitmService.cartItems;
    }

    this.form = this.formBuilder.group({
      orderQuantity: [null],
      allPrice: [null]
    });

    this.form.patchValue({
      orderQuantity: 1,

    });

  }

  listAllOitm() {
    this.oitmService.getAll().subscribe(
      data => {
        //console.log(data)
        data.forEach(data => {
          console.log(data.u_vevokodok, data.projekt, data.itemcode)
        });
        this.productArray = data;
        this.setImages();
      },
      error => {
        console.warn(error);
      },

      () => {
        this.productArray.sort((a, b) => a.itemname.localeCompare(b.itemname))
        this.checkVevokod();
        this.filteredProductArray = this.filteredForVevokod;
        //console.log(this.filteredProductArray);
        //this.filteredProductArray = this.productArray
        this.resizingPegination();
      }
    );

  }

  getIndex(i: number) {
    this.activeCardIndex = i;
  }

  addToCart(item: Oitm) {


    let isCreated = false;
    let modifiedItem: Oitm;

    this.default(item, 2);


    if (this.cartArray == null) {
      this.cartArray = [];
    }

    if (this.cartArray.length > 0) {
      //console.log(this.cartArray);
      this.cartArray.forEach(
        currentItem => {

          if (currentItem.itemcode == item.itemcode) {
            modifiedItem = currentItem;
            item.quantity = modifiedItem.quantity;
            isCreated = true;
            // if (isCreated) {
            if (this.nullCheck(+this.inputQuantity, currentItem)) {

              item.quantity = this.inputQuantity + item.quantity;
              currentItem.quantity = item.quantity;

            }

            // }
          }

        }
      )
    }

    if (isCreated) {
    } else {
      if (this.inputQuantity >= item.miN_KARTON) {
        item.quantity = +this.inputQuantity;
        this.cartArray.push(item);
        this.oitmService.cartItems = this.cartArray;
      } else {
        this.nullCheck(+this.inputQuantity, item)
      }
    }

    this.oitmService.cartStatus.next(this.cartArray.length);

    this.form.patchValue({
      orderQuantity: 1,
    });
    this.inputQuantity = 1;

  }

  default(product: Oitm, index: number) {
    if (this.prevItemIndex == product.itemcode || this.prevItemIndex == "") {

    } else {
      this.form.patchValue({
        orderQuantity: 1,
      });
      this.inputQuantity = 1;
    }

    this.prevItemIndex = product.itemcode;
  }

  nullCheck(inputQuantity: number, currentItem: Oitm) {
    if (inputQuantity < currentItem.miN_KARTON) {

      this.isWrongQuantity = true;
    } else {
      return true;
    }

  }

  updateIndex(buttonIndex: number) {

    const currentButtons = [];

    this.buttons.forEach(
      number => {
        currentButtons.push(number);
      }
    )


    for (let i = 0; i < this.buttons.length; i++) {

      if (buttonIndex == 3 && currentButtons[4] < this.filteredProductArray.length / this.itemNumber || buttonIndex > 3 && currentButtons[4] == this.filteredProductArray.length / this.itemNumber - 1) {
        this.buttons[i]++;
      } else if (buttonIndex > 3 && currentButtons[4] < this.filteredProductArray.length / this.itemNumber) {
        this.buttons[i] += 2;
      } else if ((buttonIndex == 1 && currentButtons[1] != 2) || (buttonIndex == 0 && currentButtons[0] == 2)) {
        this.buttons[i]--;
      } else if (buttonIndex < 1 && currentButtons[0] != 1) {
        this.buttons[i] -= 2;
      }

    }
    this.changeTheItemList(currentButtons[buttonIndex], this.prevButton);

    this.prevButton = currentButtons[buttonIndex];
    this.prevButtonIndex = this.buttons.indexOf(this.prevButton);

  }

  changeTheItemList(currentButton: number, prevButton: number) {


    const difference = currentButton - prevButton;
    this.startIndex += this.itemNumber * difference;
    this.lastIndex += this.itemNumber * difference;


  }

  previous() {
    if (this.startIndex != 0) {
      if (this.startIndex > 18 && this.prevButtonIndex <= 2) {
        for (let i = 0; i < this.buttons.length; i++) {
          this.buttons[i]--;
        }
      } else {

        this.prevButtonIndex--;
      }

      this.prevButton--;
      this.startIndex -= this.itemNumber;
      this.lastIndex -= this.itemNumber;

    }
  }

  next() {
    if (this.lastIndex < this.filteredProductArray.length - 1) {
      if (this.startIndex < this.filteredProductArray.length - 18 && this.filteredProductArray.length > 45 && this.prevButtonIndex >= 2) {
        for (let i = 0; i < this.buttons.length; i++) {
          this.buttons[i]++;
        }
      } else {
        this.prevButtonIndex++;
      }

      this.prevButton++;
      this.startIndex += this.itemNumber;
      this.lastIndex += this.itemNumber;
    }
  }

  filteredProducts(searchString: string, gasztroString: string, retailString: string, projektString: string) {

    this.filteredProductArray = this.filteredForVevokod;
    //console.log(this.productArray);
    this.resizingPegination();
    if (searchString || gasztroString || retailString || projektString) {
      if (searchString) {
        this.filteredProductArray = this.filteredProductArray.filter(product => {
          if (product.itemname && product.itemname.toLowerCase().includes(searchString.toLowerCase())) {
            return true;
          }
          return false;
        });
      }
      this.resizingPegination();

      if (gasztroString) {
        this.filteredProductArray = this.filteredProductArray.filter(product => {
          if (product.gasztro === 'Y') {
            return true;
          }
          return false;
        });
      }

      if (projektString) {
        this.filteredProductArray = this.filteredProductArray.filter(product => {
          if (product.projekt === 'Y') {
            return true;
          }
          return false;
        });
      }

      this.resizingPegination();


      if (retailString) {
        this.filteredProductArray = this.filteredProductArray.filter(product => {

          if (product.retail === 'Y') {
            return true;
          }
          return false;
        })
      }
      this.resizingPegination();

      return this.filteredProductArray;

    } else {
      return this.filteredForVevokod;
    }

  }


  resizingPegination() {

    this.prevButton = 1;
    this.startIndex = 0;
    this.lastIndex = 9;
    this.buttons = [1, 2, 3, 4, 5],
      this.prevButtonIndex = 0;

    if ((this.filteredProductArray.length / this.itemNumber) < 4) {

      this.buttons.length = this.calculatePegination(this.filteredProductArray.length);
    }
  }


  calculatePegination(peginationLength: number) {
    if (peginationLength % this.itemNumber == 0) {
      return peginationLength / this.itemNumber;
    } else {
      return Math.floor(peginationLength / this.itemNumber) + 1;
    }
  }


  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredProductArray = this.filteredProducts(value, this._isGasztro, this._isRetail, this._isProjekt);
  }

  get isGasztro(): string {
    return this._isGasztro;
  }

  set isGasztro(value: string) {
    this._isGasztro = value;
    this.filteredProductArray = this.filteredProducts(this._searchTerm, value, this._isRetail, this._isProjekt);

  }

  get isProjekt(): string {
    return this._isProjekt;
  }

  set isProjekt(value: string) {
    this._isProjekt = value;
    this.filteredProductArray = this.filteredProducts(this._searchTerm, this._isGasztro, this._isRetail, value); //
  }

  get isRetail(): string {
    return this._isRetail;
  }

  set isRetail(value: string) {
    this._isRetail = value;
    this.filteredProductArray = this.filteredProducts(this._searchTerm, this._isGasztro, value, this._isProjekt);
  }

  setImages() {
    this.productArray.forEach(
      product => {
        this.counter++;
        //console.log(product.itemcode)
        let periodic_itemcode = product.itemcode.replace("/", "");
        //console.log(periodic_itemcode);
        const src = 'assets/img/' + periodic_itemcode + '.jpg';
        product.image = src;

        product.quantity = 0;

        this.testCounter++;
      }
    );
  }

  changeQuantityStatus() {
    this.isWrongQuantity = false;
  }

  checkVevokod() {
    this.counter = 0;
    this.filteredForVevokod = [];
    this.productArray.forEach(

      product => {
        if (product.u_vevokodok != null) {
          // console.log(product);
          this.splitingString(product);
        } else {

          this.counter++;
          this.filteredForVevokod.push(product);
        }
      }
    );
    //console.log(this.filteredForVevokod)
    //console.log(this.counter);
  }

  splitingString(product: Oitm) {
    console.log(product.u_vevokodok);
    this.splitStringArray = product.u_vevokodok.split(',');
    //console.log(this.splitStringArray)
    this.splitStringArray.forEach(
      splitString => {
        // console.log('felhasznalo: ' + this.user.lastName)
        if (splitString === this.user.lastName) {
          //console.log('bejött')
          this.filteredForVevokod.push(product);
        }
      }
    );
  }

  changeLanguage(language: string) {
    if (language === 'HUN') {
      this.shopLanguage = {
        search: 'Keresés',
        productSearch: 'Termék keresés',
        packagingUnit: 'Csomagolási egység',
        minOrderQuantity: 'Minimum rendelés',
        price: 'Egységár',
        next: 'Következő',
        previous: 'Előző',
        karton: 'Karton',
        packages: 'csomag',
        pallet: 'Raklap',
        package: 'csomag',
        netPrice: 'Nettó egységár',
        cartons: 'karton',
        close: 'Bezár',
        wrongQuantity: 'Helytelen mennyiség!',
        wrongQntDesc: 'A Min rendelhető mennyiségnél kevesebbet nem adhat meg.'
      };


    } else {

      this.shopLanguage = {
        search: 'Search',
        productSearch: 'Product search',
        packagingUnit: 'Packaging unit',
        minOrderQuantity: 'Min order quantity',
        price: 'Price',
        next: 'Next',
        previous: 'Previous',
        karton: 'Carton',
        packages: 'packages',
        pallet: 'Pallet',
        package: 'package',
        netPrice: 'Net unit price',
        cartons: 'cartons',
        close: 'Close',
        wrongQuantity: 'Wrong quantity!',
        wrongQntDesc: 'Please do not enter les quantity then min order quantity.'
      };

    }
  }

  setPriceByDiscountPeriod(_priceByDiscountPeriod: boolean) {
     if (_priceByDiscountPeriod) {
        this.priceByDiscountPeriod = true}
      else this.priceByDiscountPeriod = false
  }

  //időszaki kedvezmény
  setDiscountPrices() {
    this.filteredProductArray.forEach(product => {
      product.discountPrice = product.price*0.9
    });
  }

  //mennyiségi kedvezmény
  setQuantityDiscountPrices() {
    this.filteredProductArray.forEach(product => {
      this.priceByDiscountPeriod ? (product.quantityDiscountPrice = product.price*0.8) : (product.quantityDiscountPrice = product.price*0.9)
    });
  }

  checkQuantityDiscountPrices() {
    console.log(this.inputQuantity)
  }


}
