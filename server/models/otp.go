package models

import (
	"time"

	"gorm.io/gorm"
)

type Otp struct {
	gorm.Model
	Email      string    `json:"email"`
	OtpCode    string    `json:"otpCode"`
	ExpireDate time.Time `json:"expireDate"`
	UserId     uint      `json:"userId"`
	User       User      `json:"user" gorm:"foreignKey:UserId"`
}
