export default interface IHotelRoom {
    index: number;
    name: string;
    price: number;
    bedType: string;
    facilities: Array<string>;
    images?: Array<any>;
    guests?: number;
}