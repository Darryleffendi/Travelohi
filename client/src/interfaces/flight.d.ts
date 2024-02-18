export default interface Flight {
    planeCode : string;
    price : number;
    departureCityId : number;
    arrivalCityId : number;
    departureTime : Date;
    arrivalTime : Date;
}