package models

import (
	"gorm.io/gorm"
)

type Seat struct {
	gorm.Model
	FlightId    uint `json:"flightId"`
	UserId      uint `json:"userId"` // Not Foreign Key (Avoiding Circular references)
	RowIndex    uint `json:"rowIndex"`
	ColumnIndex uint `json:"columnIndex"`
}