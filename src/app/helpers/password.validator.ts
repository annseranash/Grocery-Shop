import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function PasswordValidator(control:AbstractControl):{[key:string]:boolean}|null{
    const Password=control.get('password');
    const confirm_password=control.get('confirm_password');
    if(Password.pristine || confirm_password.pristine){
        return null;
    }
    return Password && confirm_password && Password.value!=confirm_password.value ? 
    {'misMatch':true}:null;
}
export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value as string;
      // check if the password is empty
      if (!password) {
        return { required: true };
      }
  
      // check if the password meets the required pattern
      const pattern = /^(?=.*\d)(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!pattern.test(password)) {
        return { invalid: true };
      }
  
      return null;
    };
  }
