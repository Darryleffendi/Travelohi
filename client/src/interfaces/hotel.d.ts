
export default interface IHotel {
    name: string;
    description: string;
    address: string;
    facilities: Array<string>;
    city: string;
    // Data in frontend
    images?: Array<any>;
    frontImage?: any;
    
    // Data from backend
    imageUrl?: any;
    imageUrls?: Array<any>;
}