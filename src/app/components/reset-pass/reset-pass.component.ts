import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { FORM_ERRORS } from 'src/app/form-error-msg';
import { ResetPassword } from 'src/app/models/reset-password.model';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent {
  resetPasswordForm!:FormGroup;
  emailToReset!:string;
  emailToken!:string;
  resetpasswordObj=new ResetPassword();
  formErrors=FORM_ERRORS;
  constructor(private fb:FormBuilder){}

  ngOnInit(){
    this.resetPasswordForm=this.fb.group({
      password:[null,Validators.required],
      confirm_password:[null,Validators.required]
    })
  }
  getErrorMsg(controlName:string,errorName:string){
    return this.formErrors[controlName][errorName];
  }

}
