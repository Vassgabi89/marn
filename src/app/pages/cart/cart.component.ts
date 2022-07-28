import { Component, OnInit } from '@angular/core';
import { Oitm } from 'src/app/model/oitm';
import { OitmService } from 'src/app/services/oitm.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartLanguage: { cart: string, productName: string, price: string, quantity: string, lineTotal: string,
                  fullPrice: string, order: string, weight: string, totalWeight: string, netPrice: string
                  close: string, wrongWeight: string, wrongWeightDesc: string }


  cartItems: Oitm[];
  sum: number = 0;
  totalWeight: number = 0;
  user: User;
  notEnoughtWeight: boolean = true;



  constructor(private oitmService: OitmService,  private router: Router) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.changeLanguage(this.user.language);


    if (this.oitmService.cartItems != null) {
      this.cartItems = this.oitmService.cartItems
      this.cartItems.sort((a, b) => a.itemname.localeCompare(b.itemname))
      if (this.cartItems != null) {
        this.calculateSum();
      }
    } else {
      this.router.navigate(['/shop']);

    }



  }

  deleteItem(itemCode: string) {
    this.cartItems.forEach(
      item => {
        if (item.itemcode == itemCode) {
          const index = this.cartItems.indexOf(item);
          this.sum -= (item.quantity * item.price * item.karton);
          this.totalWeight -= (item.quantity * item.sWeight1 * item.karton);
          this.cartItems.splice(index, 1);
        }
      }
    )
    this.oitmService.cartStatus.next(this.cartItems.length);
    if (this.cartItems.length == 0) {
      this.router.navigate(['/shop']);
    }
  }


  increaseQuantity(itemcode: string) {
    this.cartItems.forEach(
      item => {
        if (item.itemcode == itemcode) {
            item.quantity++;
            this.sum += item.price * item.karton;
            this.totalWeight +=  item.sWeight1 * item.karton;
        }
      }
    )

  }

  decreaseQuantity(itemcode: string) {
    this.cartItems.forEach(
      item => {
        if (item.itemcode == itemcode) {
          if (item.quantity > item.miN_KARTON) {
            item.quantity--;
            this.sum -= item.price * item.karton;
            this.totalWeight -=  item.sWeight1 * item.karton;
          }

        }
      }
    )


  }

  calculateSum() {

    this.cartItems.forEach(
      item => {
        
        this.sum += (item.quantity * item.price * item.karton);
        this.totalWeight += (item.quantity * item.sWeight1 * item.karton);
      }
    )
  }

  navigateOrder() {
    if(this.weightCheck(this.totalWeight / 1000)){
      this.oitmService.sum = this.sum;
      this.router.navigate(['/order']);
    }
    
  }

  changeLanguage(language: string) {
    if (language === 'HUN') {
      this.cartLanguage= { cart: 'Kosár', productName: 'Termék név', price: 'Egységár',
       quantity: 'Mennyiség', lineTotal: 'Teljes ár', fullPrice: 'Teljes összeg', order: 'Rendelés', weight: 'Súly', totalWeight: 'Összsúly',
      netPrice: 'Nettó érték', close: 'Bezár', wrongWeight: 'Mennyisági probléma!', wrongWeightDesc: 'A minimális rendelhető mennyiség 500kg' }

    } else {

      this.cartLanguage= { cart: 'Cart', productName: 'Product name', price: 'Price',
       quantity: 'Quantity', lineTotal: 'Line total', fullPrice: 'Full price', order: 'Oreder', weight: 'Weight', totalWeight: 'Total Weight',
      netPrice: "Net value", close: 'Close', wrongWeight: 'Ploblems with quantity!', wrongWeightDesc: 'Minimum order quantity 500kg'}
    
    }
  }

  weightCheck(totalWeight: number) {
    if (totalWeight < 500) {
      this.notEnoughtWeight = true;
    }else{
      this.notEnoughtWeight = false;
      return true;
    }

  }

  weightIsEnought(){
    this.notEnoughtWeight = false;
  }


}