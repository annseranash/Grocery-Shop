import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject, map, throwError} from 'rxjs';
import { environment } from '../environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  showMinus:boolean[]=[];
  public cartItemList:any=[]; 
  public productList=new BehaviorSubject<any>([]); // holds products avilable for purchase
  userId: any;
  productId:any;
  constructor(private http:HttpClient,private authService:AuthService){
    this.userId=this.authService.getUserId();  
  }

  getCartProduct(userId:any){
    return this.http.get<any[]>(`${environment.GetCartItems}/${userId}`).pipe(
      map(cartItems=>cartItems.filter(item=>item.quantity>0))
      ); 
  }

  addToCart(product: any,cartData?) {
    if(cartData) {
      this.cartItemList = cartData

    }
    const existingItemIndex = this.cartItemList.findIndex((item: any) => item?.productId === product.productId);
    if (existingItemIndex === -1) {
      product.quantity = 1;
      product.total = product.price;
      this.cartItemList.push(product);
    } else {
      const existingItem = this.cartItemList[existingItemIndex];
      existingItem.quantity+=1; 
      existingItem.total = existingItem.quantity * existingItem.price;
      product.quantity = existingItem.quantity
      product.total=existingItem.total;
    }
    this.productList.next(this.cartItemList)
    this.userId=this.authService.getUserId();  
    const body = {
      productId: product.productId,
      description: product.description,
      name: product.name,
      quantity:1,
      total:product.total, 
      imageURL: product.imageURL,
      price: product.price,
      IsDeleted: product.IsDeleted,
      userId: this.userId
    };
    return this.http.post<any[]>(`${environment.createCart}/${this.userId}`, body)
      .subscribe(res => {
        console.log("Items added to the cart successfully");
        console.log(res, "add to cart res");
      }, err => {
        console.log("Error in adding item to cart", err);
      });
} 

 decrementCartItem(product:any,itemId:any,cartData?){
  if(cartData) {
    this.cartItemList = cartData
  }
  const existingItemIndex=this.cartItemList.findIndex((item:any)=>item.productId===product.productId);
  if(existingItemIndex!=-1){
    const existingItem=this.cartItemList[existingItemIndex];
    existingItem.quantity--;
    existingItem.total=existingItem.quantity*existingItem.price;
    if(existingItem.quantity===0){
      this.cartItemList.splice(existingItemIndex,1);
    }  
    this.productList.next(this.cartItemList);
    this.userId=this.authService.getUserId();  
    const body = {
      productId: product.productId,
      description: product.description,
      name: product.name,
      quantity:-1,
      total:existingItem.total,
      imageURL: product.imageURL,
      price: product.price,
      IsDeleted: product.IsDeleted,
      userId: this.userId
    };
      return this.http.post<any>(`${environment.createCart}/${this.userId}`, body)
    .subscribe(res => {
      console.log("Cart items updated successfully",res);
    }, err => {
      console.log("Error in updating the cart items", err);
    });
    
  }
  return throwError(()=>new Error('Product not found in cart'))
}

removeCartItem(userId:any,productId:any){
  return this.http.delete(`${environment.deleteCart}/${userId}/${productId}`); 
}

removeAllCart(){
  return this.http.delete<any>(`${environment.deleteCart}/${this.userId}`);
}

getTotalPrice() {
return this.getCartProduct(this.userId).pipe(
    map((res: any) => {
      this.cartItemList = res;
      let grandTotal = 0;
      this.cartItemList.forEach((item: any) => {
        grandTotal += item.total;
      });
      return grandTotal;
    })
  );

}
}