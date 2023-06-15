import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http:HttpClient) { }
  sendResetPasswordLink(email:string){
    return this.http.post<any>(`${environment.sendResetEmail}/${email}`,{})
  }
  resetPassword(resetPasswordObj:ResetPassword){
    return this.http.post<any>(`${environment.resetPasswordURL}`,resetPasswordObj);
  }
}
