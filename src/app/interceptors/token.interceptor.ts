import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService,private toast:NgToastService,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken=this.authService.getToken(); //get the token
    //modify the token that it gets appended in header
    if(myToken){
      //modify the request and set the token value
      request=request.clone({
        setHeaders:{Authorization:`Bearer ${myToken}`}// "Bearer "+myToken
      })
    }

    return next.handle(request)//sending the request
    .pipe(catchError((err:any)=>{
      console.log(err)
      if(err instanceof HttpErrorResponse){
        if(err.status==401){
          this.toast.warning({detail:'WARNING',summary:'Token is expired,Login Again'});
          this.router.navigate(['login']);
        }
      }
      return throwError(()=>new Error("Some other error occurred"));
      
    }))
    }
}

