import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  id:any;
  
  constructor(private http :HttpClient,private router:Router) { }

  onSignup(signupObj:any){
   return this.http.post(`${environment.baseUrl}/register`, signupObj);
  }

  onLogin(loginObj:any){
    return this.http.post(`${environment.baseUrl}/Authenticate`,loginObj);
  }
  onLogout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string | undefined = ''){
    localStorage.setItem('token', tokenValue);
  }
  
  getToken():string{
    return localStorage.getItem('token') || '';
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token') && !!localStorage.getItem('userId') && !!localStorage.getItem('username');
  } 

  storeUserId(userId:any){
    localStorage.setItem('userId',userId); 
  }

  storeUserName(username:string){
    localStorage.setItem('username',username); 
  }
  
  getUserName():string{
    return localStorage.getItem('username');
  }

  getUserId(){
    return localStorage.getItem('userId');
  }

}

