package models

import (
	"gorm.io/gorm"
)

type PlaneModel struct {
	gorm.Model
	Name         string `json:"name"`
	Manufacturer string `json:"manufacturer"`
	RowsAmount   int    `json:"rowsAmount"`
	SeatsPerRow  int    `json:"seatsPerRow"`
}
