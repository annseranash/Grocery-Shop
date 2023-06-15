export const FORM_ERRORS={
    firstname:{
        required:'Firstname is required', 
        minlength:'Firstname must be atleast 4 characters long'
    },
    email:{
       required:'Email is required',
       email:'Invalid Mail Format' 
    },
    username:{
        required:'Username is required',  
        minlength:'Username must be atleast 4 characters long'
    },
    password:{
        required:'Password is required',
        pattern:'Password must contain at least one digit,one letter, and one special character'
    },
    confirm_password:{
        required:'Confirm Password is required',
        misMatch:'Passwords do not match'
    }
}