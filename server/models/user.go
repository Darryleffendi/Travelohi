package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName        string    `json:"firstName"`
	LastName         string    `json:"lastName"`
	Email            string    `json:"email" gorm:"unique"`
	Password         string    `json:"password"`
	Gender           string    `json:"gender"`
	BirthDate        time.Time `json:"dob"`
	ReceiveEmail     bool      `json:"receiveEmail"`
	SecurityQuestion string    `json:"securityQuestion"`
	SecurityAnswer   string    `json:"securityAnswer"`
	Role             string    `json:"role" gorm:"default:'user'"`
	Banned           bool      `json:"banned"`
	ImageUrl         string    `json:"imageUrl"`
	Address          string    `json:"address"`
	PhoneNumber      string    `json:"phoneNumber"`
	CardNumber       string    `json:"cardNumber"`
	CardHolder       string    `json:"cardHolder"`
	CardExpiry       string    `json:"cardExpiry"`
	CardCvv          string    `json:"cardCvv"`
	WalletBalance    uint64    `json:"walletBalance" gorm:"default:1000"`
}
