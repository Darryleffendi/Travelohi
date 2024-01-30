import IUser from "../interfaces/user";



export function validateEmail(email : string) :boolean {
    // Regular expression for the desired format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test if the email is banned


    // Test the email against the regular expression and check for ".com" at the end
    return emailRegex.test(email) && email.endsWith(".com");
}

export function validateName(name : string) :boolean {

    const lettersRegex = /^[a-zA-Z]+$/;

    return name.length >= 5 && lettersRegex.test(name)
}

export function validateGender(gender : string) :boolean {
    if(gender !== 'male' && gender !== 'female') {
        return false
    }

    return true;
}

export function validateAge(age : number) :boolean {
    if(age < 13) return false;
    return true;
}

export function validatePassword(password : string) :boolean {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
  
    const hasLowercase = lowercaseRegex.test(password);
    const hasUppercase = uppercaseRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const hasSymbol = symbolRegex.test(password);
  
    return hasLowercase && hasUppercase && hasNumber && hasSymbol && password.length >= 8 && password.length <= 30;
}

export function validateEmpty(newData : IUser) : boolean {
    if(newData.email === '') return false;
    if(newData.firstName === '') return false;
    if(newData.lastName === '') return false;
    if(newData.gender === '') return false;
    if(newData.password === '') return false;
    if(newData.securityAnswer === '') return false;
    if(newData.securityQuestion === '') return false;
    return true;
}