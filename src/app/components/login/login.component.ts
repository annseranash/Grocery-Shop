import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/valildateForm';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  type:string="password";
  isText:boolean=false;
  eyeIcon:string='fa-eye-slash';
  loginForm!:FormGroup;
  user: SocialUser;
  loggedIn: boolean;
  public resetPasswordEmail!:string;
  public isValidEmail!:boolean;
  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private toast:NgToastService,
    private socialAuth: SocialAuthService,
    // private resetPwd:ResetPasswordService,
    ){ }

  ngOnInit(){
    this.loginForm=this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    });
    this.socialAuth.authState.subscribe(async (user) => {
    console.log(this.socialAuth.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID))
    this.socialAuth.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID);
    this.user = user; 
      localStorage.setItem('token', JSON.stringify(user.idToken));
      const name=user.firstName;
      const nameToString=JSON.stringify(name);
      const username=nameToString.replaceAll('"','').replaceAll("'",'')
      localStorage.setItem('username', username);
      localStorage.setItem('userId', JSON.stringify(user.id));
      localStorage.setItem('userId', JSON.stringify(user));

      this.loggedIn = (user != null);
      console.log("User",this.user);
    });
  }

  hideShowPass() {
    this.isText=!this.isText;
    this.isText ?  this.eyeIcon="fa-eye":this.eyeIcon="fa-eye-slash";
    this.isText ? this.type="text" : this.type="password";
  }
  onSubmit(){
  if(this.loginForm.valid){
      //send data to database
      this.authService.onLogin(this.loginForm.value).subscribe({
        next:(res:any)=>{
          console.log("response",res);
          if(res && res.user.token && res.user.userId && res.user.username){
            this.authService.storeToken(res.user.token);
            this.authService.storeUserId(res.user.userId);
            this.authService.storeUserName(res.user.username);
          } 
          this.toast.success({detail:'SUCCESS',summary:res.message,duration:5000})
          this.router.navigate(['home']);
        },
        error:(err)=>{
          this.toast.error({detail:'ERROR',summary:'Invalid credentials',duration:5000})
          this.loginForm.reset();
        }
      })
      console.log(this.loginForm.value);
    }
    else{
      alert('Your Form is invalid');
      ValidateForm.validateAllFormFields(this.loginForm);
    }
}
  // checkValidEmail(event:string){
  //   const value=event;
  //   const pattern=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
  //   this.isValidEmail=pattern.test(value);
  //   return this.isValidEmail;
  // }
  // confirmToSend(){
  //   if(this.checkValidEmail(this.resetPasswordEmail)){
  //     console.log(this.resetPasswordEmail);
  //     //API call
  //     this.resetPwd.sendResetPasswordLink(this.resetPasswordEmail)
  //     .subscribe({
  //       next:(res)=>{
  //         this.toast.success({
  //           detail:'SUCCESS',
  //           summary:'Password Reset successful',
  //           duration:3000,
  //         });
  //         this.resetPasswordEmail='';
  //         const buttonRef=document.getElementById('closeBtn');
  //         buttonRef?.click();
  //       },
  //       error:(err)=>{
  //         this.toast.error({
  //           detail:'ERROR',
  //           summary:'Something went wrong',
  //           duration:3000,
  //         });
  //       }
  //     })
  //   }
  // }
}
