import { Component, OnInit } from '@angular/core';
import { AuthenticationsService } from 'src/app/services/authentications.service';
import { Router } from '@angular/router';
import { OitmService } from 'src/app/services/oitm.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public isLogedIn: any = this.auth.currentUserValue;

  itemsInCart: number = 0;
  user: User;
  menuLanguage: { logout: string, orders: string, bills: string, products: string, cart: string }

  constructor(private auth: AuthenticationsService,
    private router: Router, private oitmSevice: OitmService,
    //private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user) {
      this.changeLanguage(this.user.language);  
    } else {
      this.changeLanguage('HUN');  
    }
    

    this.auth.currentUser.subscribe(
      user => {this.isLogedIn = user
      }
    )
    this.oitmSevice.cartStatus.subscribe(
      itmeStatus => {
        this.itemsInCart = itmeStatus;
      }
    )

  }

  onLogout() {
    this.auth.logout();
    this.router.navigateByUrl("/login")
    //this.isLogedIn= this.auth.currentUserValue;

  }

  logedIn(): boolean {
    return this.auth.currentUserValue !== null;
  }


  changeLanguage(language: string) {
    if (language === 'HUN') {
      this.menuLanguage = { logout: 'Kijelentkezés', orders: 'Rendelések', bills: 'Számla lista', products: 'Termékek', cart: 'Kosár' }
    } else {

      this.menuLanguage = { logout: 'Logout', orders: 'Orders', bills: 'Bills', products: 'Products', cart: 'Cart' }
    
    }
  }
}