package models

import "gorm.io/gorm"

type City struct {
	gorm.Model
	Name        string  `json:"name"`
	CountryId   uint    `json:"countryId"`
	Country     Country `gorm:"foreignKey:CountryId"`
	AirportCode string  `json:"airportCode" gorm:"default:''"`
	ImageUrl    string  `json:"imageUrl" gorm:"default:''"`
}
