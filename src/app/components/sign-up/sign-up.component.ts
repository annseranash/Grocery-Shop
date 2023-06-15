import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/valildateForm';
import {PasswordValidator, passwordValidator} from 'src/app/helpers/password.validator'
import { AuthService } from 'src/app/services/auth.service';
import { FORM_ERRORS } from 'src/app/form-error-msg';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{
  type:string="password";
  isText:boolean=false;
  eyeIcon:string='fa-eye-slash';
  signUpForm!:FormGroup;
  formErrors=FORM_ERRORS;
  constructor(private fb:FormBuilder,private authService:AuthService,private router:Router,private toast:NgToastService){}

  ngOnInit(){
    this.signUpForm=this.fb.group({
      firstname:['',[Validators.required,Validators.minLength(3)]],
      lastname:[''],
      email:['',[Validators.required,Validators.email]],
      username:['',[Validators.required,Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'), passwordValidator()]],      
      confirm_password:['',Validators.required]
    },{validator:PasswordValidator});
  }
  hideShowPass() {
    this.isText=!this.isText;
    this.isText ?  this.eyeIcon="fa-eye":this.eyeIcon="fa-eye-slash";
    this.isText ? this.type="text" : this.type="password";
  }
  onSubmit(){
    if(this.signUpForm.valid){
      console.log(this.signUpForm.value);
      this.authService.onSignup(this.signUpForm.value).subscribe({
        next:(res:any)=>{
          this.toast.success({detail:'SUCCESS',summary:res.message,duration:5000})
          this.signUpForm.reset();
          this.router.navigate(['login']);
        },
        error:(err)=>{
          this.toast.error({detail:'ERROR',summary:err.message,duration:5000})         
        }
      })     
    }else{
      alert("Your Form is invalid");
      ValidateForm.validateAllFormFields(this.signUpForm);
    }
  }


getErrorMsg(controlName:string,errorName:string){
  return this.formErrors[controlName][errorName];
}

}
