import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  userId: any;
  Orders: any[] = [];
  totalAmt: number=0;
  mrp:number=0;
  ordered_date:Date;
  delivery_date:any;
  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.cartService.getCartProduct(this.userId).subscribe((res) => {
      this.Orders = res;
      console.log(res);
      this.Orders.map((item)=>{
        if(item.is_Ordered){
          this.mrp+=item.total;
          this.ordered_date=new Date(item.ordered_date);
        }
      })
      this.delivery_date=new Date(this.ordered_date.getTime()+(24*60*60*1000));
      this.totalAmt=this.mrp+20;
    });
  }

}

