import { Component, OnInit } from '@angular/core';
import { CikkService } from 'src/app/services/cikk.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Product } from 'src/app/model/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  productGroup: FormGroup;
  product: Product = new Product();

  constructor(
    private productService: CikkService,
    private router: Router) {
    this.productGroup = new FormGroup({
      id: new FormControl(this.product.id),
      name: new FormControl(this.product.name),
      price: new FormControl(this.product.price),
      description: new FormControl(this.product.description),
      manufacturer: new FormControl(this.product.manufacturer),
      itemCode: new FormControl(this.product.itemCode),
    },{updateOn: 'blur'});
    this.productGroup.valueChanges.subscribe(
      event => console.log(event)
    )
  }


  // this.productService.validate(this.productGroup.value).toPromise().then(
  //   result => {
  //     console.log(result);
  //     if (result.valid) {
  //       this.productGroup.controls.price.setValue(result.value.price);
  //     }
  //     //this.router.navigateByUrl("/products");
  //   },
  //   err => {
  //     console.log(err);
  //     alert("Hiba történt a beszűrásnál");
  //   }

  ngOnInit() {

  }

  onSubmit() {
    console.log(this.productGroup.value);
    //console.log(this.product.price);
    this.productService.insert(this.productGroup.value).toPromise().then(
      result => {
        console.log(result);
        this.router.navigateByUrl("/products");
      },
      err => {
        console.log(err);
        alert("Hiba történt a beszűrásnál");
      }
    )
  }

  onReset() {
    //this.productGroup.setValue(new Product());
    this.productGroup.reset(new Product());

  }

}
