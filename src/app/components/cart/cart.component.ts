import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environment';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  public product: any = [];
  public grandTotal!: number;
  userId: any;
  productId: any;
  emptyCart = false;
  decrementCartItem = false;
  removedProductId = null;
  index: any;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router:Router
  ) {
    this.userId=this.authService.getUserId();
  }
  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.cartService.getCartProduct(this.userId).subscribe((res) => {
      this.decrementCartItem = false;
      this.product=res.filter((item)=>!item.is_Ordered);
      this.cartService.getTotalPrice().subscribe((grandTotal: number) => {
        this.grandTotal = grandTotal;
      });
    });
    
  }
  removeItem(userId:any, product: any) {
    this.decrementCartItem = false;
    this.removedProductId = null;
    this.cartService.removeCartItem(userId, product.productId).subscribe(
      (res) => {
        console.log('Item removed from cart', res);
        const itemIndex = this.product.findIndex(
          (item) => item.productId === product.productId
        );
        this.product.splice(itemIndex, 1);
        this.removedProductId = product.productId;
        this.decrementCartItem = true;
        this.cartService.getTotalPrice().subscribe((grandTotal: number) => {
          this.grandTotal = grandTotal;
        });
      },
      (err) => {
        console.log('Error in removing cart item', err);
      }
    );
  }
  emptycart() {
    this.cartService.removeAllCart().subscribe((res)=>{
      console.log("Cart items deleted successfully",res);
      this.cartService.getTotalPrice().subscribe((grandTotal: number) => {
        this.grandTotal = grandTotal;
        this.emptyCart = true;
        this.product = [];
        this.decrementCartItem = false;
      });
    })   
  }
  proceedToBuy(){
    this.router.navigate(['checkout']);
  }
  

  incrementCart(index: number) {
    this.cartService.getCartProduct(this.userId).subscribe((res: any) => {
      this.product = res;
      const item = this.product[index];
          this.cartService.addToCart(item, this.product);
          setTimeout(() => {
            this.cartService.getTotalPrice().subscribe((grandTotal: number) => {
              this.grandTotal = grandTotal;
            });
          }, 20);  
      });    
  }

  decrementCart(index: number) {
    this.decrementCartItem = false;
    this.cartService.getCartProduct(this.userId).subscribe((res: any) => {
      this.product = res;
      const item = this.product[index];
      if(item) {
          this.cartService.decrementCartItem(item, item.productId, this.product);
          setTimeout(() => {
            this.cartService.getTotalPrice().subscribe((grandTotal: number) => {
              this.grandTotal = grandTotal;
            });
          }, 30);
          if(item.quantity===0) {
            this.decrementCartItem = true;
          }
      }
    });
  }
}





