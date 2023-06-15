import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService} from 'ng-angular-popup';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private toast:NgToastService,private router:Router){}
  shopNow(){
    this.toast.warning({detail:'WARNING',summary:'Please Login First'});
    this.router.navigate(['login']);
    }
  }

