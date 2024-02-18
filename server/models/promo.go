package models

import "gorm.io/gorm"

type Promo struct {
	gorm.Model
	Title      string `json:"title"`
	Discount   string `json:"discount"`
	PromoCode  string `json:"promoCode" gorm:"unique"`
	ValidFrom  string `json:"validFrom"`
	ValidUntil string `json:"validUntil"`
	ImageUrl   string
}
