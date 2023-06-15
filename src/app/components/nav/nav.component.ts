import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { GroceryItem } from 'src/app/data.interface';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { RecipeService } from 'src/app/services/recipe.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  vegetables:any[]=[];
  fruits:any[]=[];
  meat:any[]=[];
  seafood:any[]=[];
  eggs:any[]=[];
  selectedCategoryId: number;
  currentPath : any;
  public productList:any;
  public productListCopy:any;
  loggedInUserName:string;
  @Input() EmptyCart: any;
  @Input() decrementCartItem: any;
  userId:any;
  data: string;
  defaultSortingOrder='';
  constructor(public authService:AuthService,
              private cartService:CartService,
              private apiService:ApiService,
              private router:Router,
              private http:HttpClient,
              private recipeService:RecipeService
              ){}
public totalItems:number=0;
public searchTerm:any='';
  logout(){
    this.authService.onLogout();
  }
  ngOnInit(){
    this.loggedInUserName=this.authService.getUserName();
    this.userId=this.authService.getUserId();
    this.cartService.getCartProduct(this.userId)
    .subscribe(res=>{
      this.totalItems=res.length;
    });
    this.currentPath=window.location.href.split('/')[3];
    this.apiService.getProducts().subscribe(res=>{
      this.productListCopy = res;
      this.productList = res;
          this.vegetables = res.filter(p => p.categoryId === 25);
          this.fruits = res.filter(p => p.categoryId === 26);
          this.meat = res.filter(p => p.categoryId === 27);
          this.seafood = res.filter(p => p.categoryId === 28);
          this.eggs = res.filter(p => p.categoryId === 29);
    });  
  }

  ngOnChanges() {
    if(this.EmptyCart) {
      this.totalItems=0
    } else {
     if(this.decrementCartItem) {
      this.totalItems -=1
      this.decrementCartItem = false
     }
    }
  }
  addCartItem(newItem:string){
    this.cartService.getCartProduct(this.userId)
    .subscribe(res=>{
      this.totalItems=res.length;
    })
  }

  search(event:any){
    this.searchTerm=(event.target as HTMLInputElement).value;   
      this.recipeService.search.next(this.searchTerm);
  }

  searchRecipe(){
    this.http.get('assets/food.json').subscribe((data: any[]) => {
      const searchResults = data.filter((food) =>
        food.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.recipeService.updateResults(searchResults);
      this.recipeService.updateContainerVisibility(true);//show the container
      this.searchTerm='';
    });
  }

  public selectCategory(categoryId: number){
   this.selectedCategoryId = categoryId;
   if(this.selectedCategoryId) {
    this.productList = this.productListCopy.filter((data) => data.categoryId === this.selectedCategoryId) 
  } else {
    this.productList = this.productListCopy;
  }
  this.defaultSortingOrder = "";
    switch (categoryId) {
      case 25:
        this.productList = this.vegetables;
        break;
      case 26:
        this.productList = this.fruits;
        break;
      case 27:
        this.productList = this.meat;
        break;
      case 28:
        this.productList = this.seafood;
        break;
      case 29:
        this.productList = this.eggs;
        break;
      default:
        this.productList = [];
        break;
    }
    if(categoryId && this.productList.length>0) {
      this.router.navigate(['/home']);
      this.productList.forEach((a:any,index:number)=>{
      this.cartService.getCartProduct(this.userId).subscribe((res) => {
        if(res.length == 0) {
          this.productList[index].quantity = 0;
        } else {
          res.forEach((b:any)=>{
            if(a.productId === b.productId) {
              this.productList[index].quantity = b.quantity
            } else {
              this.productList[index].quantity= 0;
            }  
          }) 
        }
        
      })
    });
      localStorage.setItem('productCopy',JSON.stringify(this.productList))
    }
  } 
  sortByPriceLowToHigh(){
    if(this.selectedCategoryId) {
      this.productList=this.productList.sort((a,b)=>a.price-b.price);
    }
    else
      this.apiService.getProducts('asc').subscribe((data:GroceryItem[])=>{
        this.productList=data.sort((a,b)=>a.price-b.price);
      });
  }
  sortByPriceHighToLow(){
    if(this.selectedCategoryId) {
      this.productList=this.productList.sort((a,b)=>b.price-a.price);
    }
    else
    this.apiService.getProducts('desc').subscribe((data:GroceryItem[])=>{
      this.productList=data.sort((a,b)=>b.price-a.price);
    })
  }
  getSortingOrder(sortOrder:any){
    if(sortOrder==='asc' ){
      this.sortByPriceLowToHigh();
    }else if(sortOrder==='desc' ){
      this.sortByPriceHighToLow();
    }
    else{
      this.productList=this.productListCopy;
    }
  }

}
