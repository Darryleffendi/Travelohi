export default interface IPromo {
    title : string,
    discount : number,
    promoCode : string,
    validFrom : date,
    validUntil : date,
    promoType? : string
}