package models

import (
	"gorm.io/gorm"
)

type SeatCart struct {
	gorm.Model
	FlightId uint   `json:"flightId"`
	Flight   Flight `json:"flight" gorm:"foreignKey:FlightId"`
	UserId   uint   `json:"userId"`
	Seats    string `json:"seats"` // JSON {rowIndex, columnIndex}[]
	Baggage  uint   `json:"baggage"`
	Status   string `json:"status" gorm:"default:'unpaid'"`
	SeatIds  string `json:"seatIds"` // JSON Seat[]
}
