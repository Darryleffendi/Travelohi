package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FirstName        string `json:"firstName"`
	LastName         string `json:"lastName"`
	Email            string `json: "email" gorm: "unique"`
	Password         string `json: "password"`
	Gender           string `json: "gender"`
	BirthDate        string `json: "dob"`
	ReceiveEmail     bool   `json: "receiveEmail"`
	SecurityQuestion string `json: "securityQuestion"`
	SecurityAnswer   string `json: "securityAnswer"`
}
