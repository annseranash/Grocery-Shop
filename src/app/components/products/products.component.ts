import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { Output, EventEmitter } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  searchKey:string="";
  userId:any;
  cartData:any;
  @Input() productList: any;
  @Input() selectedCategoryId: any;
  @Output() cartBadgeEvent=new EventEmitter<string>();
  
  constructor(private api:ApiService,public cartService:CartService,private recipeService:RecipeService){}
 ngOnInit(){
 
  if(!JSON.parse(localStorage.getItem('productCopy'))) {
    this.api.getProducts().subscribe(res=>{
      this.productList.forEach((a:any,index:number)=>{
        Object.assign(a,{quantity:0,total:a.price});
        this.cartService.showMinus[index]=false;
      });
  });
  } 
  else {
    this.productList = JSON.parse(localStorage.getItem('productCopy'))
    this.productList.forEach((a:any,index:number)=>{
      Object.assign(a,{quantity:0,total:a.price});
      this.cartService.showMinus[index]=false;
    });
  localStorage.removeItem('productCopy')
  }
    this.recipeService.search.subscribe((val:any)=>{
      this.searchKey=val;
    });
}
  addToCart(index: number) {
    const item=this.productList[index];
    this.cartService.addToCart(item,this.cartData);
    setTimeout(()=>{ 
      this.cartBadgeEvent.emit(item);
  }, 10);
    if (item.quantity > 0) {
    this.cartService.showMinus[index] = true;
    }
  }

decreaseQuantity(index:number){
  const item = this.productList[index];
    if(item.quantity === 0){
      this.cartService.showMinus[index] = false;
    }
  this.cartService.decrementCartItem(item,item.productId,this.cartData);
  setTimeout(()=>{                           
    this.cartBadgeEvent.emit(item);
},25);
}

}