import IUser from "./user";

export default interface IAuthPageParameters {
    setSubpage : Function;
    addNewData : Function;
    submitForm? : Function;
    newData : IUser | any;
    errorMessage: string;
}