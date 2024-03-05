package models

import "gorm.io/gorm"

type HotelRoom struct {
	gorm.Model
	Name       string  `json:"name"`
	Price      float64 `json:"price"`
	BedType    string  `json:"bedType"`
	Facilities string  `json:"facilities"`
	ImageUrls  string  `json:"imageUrls"`
	Guests     uint64  `json:"guests"`
	Capacity   uint64  `json:"capacity"`
	HotelId    uint64  `json:"hotelId"`
	Hotel      Hotel   `gorm:"foreignKey:HotelId"`
}
