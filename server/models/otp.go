package models

import "gorm.io/gorm"

type Otp struct {
	gorm.Model
	Email string `json:"email"`
}
