import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environment';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  CartItems:any[]=[];
  FullName:string;
  email:string;
  amount:number;
  paymentHandler:any=null;
  userId: any;
  total:number;
  constructor(
    private authService:AuthService,
    private http:HttpClient,
    private cartService:CartService,
    private router:Router
  ){}
  ngOnInit(){
    this.userId = this.authService.getUserId();
    this.cartService.getCartProduct(this.userId).subscribe((res)=>{
      this.CartItems=res;
      this.cartService.getTotalPrice().subscribe((grandTotal:number)=>{
        this.total=grandTotal;
      })
    })
    let details=this.authService.getStoreDetails();
    this.FullName=details.firstName+" "+details.lastName;
    this.email=details.email;
    this.invokeStripe();
  }
  checkout(amount:number){
    const paymentHandler=(<any>window).StripeCheckout.configure({
      key:"pk_test_51NJFHrSDDyMmrIfGc3jlxKtw6bXSTECtRim4BZaDwG5ZvS5wNO2HTpRHd9wZXu8ESq91IlwFeNQvZsmvXTU6yR3t00qYtyQaTE",
      locale:'auto',
      token:function(stripeToken:any){
        console.log(stripeToken);
      },
      closed:()=>{
        this.router.navigate(['orders']);
      }
    });
    paymentHandler.open({  // to open the Stripe checkout dialog box
      //displays payment form wher user can enter payment details
      name:'Payment Gateway',
      description:'Choose Fresh',
      amount : amount * 100,
    })
    this. updateOrderStatus();
  }

  updateOrderStatus(){
    const requestOptions={
      headers:new HttpHeaders({'Content-Type':'appliaction/json'}),
      body:{Is_Ordered:true,Ordered_Date:new Date()}
    }
    return this.http.put<any>(`${environment.updateOrderStatus}/${this.userId}`,requestOptions).subscribe(()=>{
      console.log('Order status updated');
    },(error)=>{
      console.log('Error in updating the order status',error);
    });
  }

  invokeStripe(){ // loading stripe checkout script
      const script=window.document.createElement('script');
      script.id='stripe-script';
      script.type='text/javascript';
      script.src='https://checkout.stripe.com/checkout.js';
      script.onload=()=>{
        this.paymentHandler=(<any>window).StripeCheckout.configure({
          key:'pk_test_51NJFHrSDDyMmrIfGc3jlxKtw6bXSTECtRim4BZaDwG5ZvS5wNO2HTpRHd9wZXu8ESq91IlwFeNQvZsmvXTU6yR3t00qYtyQaTE',
          locale:'auto',
          token:function(stripeToken:any){
            console.log(stripeToken)
          },
        });
      };
      window.document.body.appendChild(script);
    }  
}
