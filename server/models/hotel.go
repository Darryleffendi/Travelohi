package models

import "gorm.io/gorm"

type Hotel struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	Address     string `json:"address"`
	ImageUrl    string `json:"imageUrl"`
	ImageUrls   string `json:"imageUrls"`
	Facilities  string `json:"facilities"`
	CityId      uint   `json:"cityId"`
	City        City   `gorm:"foreignKey:CityId"`
}
