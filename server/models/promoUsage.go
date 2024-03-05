package models

import (
	"gorm.io/gorm"
)

type PromoUsage struct {
	gorm.Model
	UserId    uint   `json:"userId"`
	PromoCode string `json:"promoCode"`
	User      User   `json:"user" gorm:"foreignKey:UserId"`
}
