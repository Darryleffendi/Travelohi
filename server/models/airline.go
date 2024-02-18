package models

import (
	"gorm.io/gorm"
)

type Airline struct {
	gorm.Model
	Name     string `json:"name"`
	ImageUrl string `json:"imageUrl"`
}
