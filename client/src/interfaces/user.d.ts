export default interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    dob: Date;
    gender: string;
    password: string;
    confirmPassword? : string;
    securityQuestion? : string;
    securityAnswer? : string;
    role? : string;
    emailList? : boolean;
    imageUrl? : any;
    ID? : number;
}