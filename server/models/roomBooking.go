package models

import (
	"time"

	"gorm.io/gorm"
)

type RoomBooking struct {
	gorm.Model
	RoomId uint      `json:"roomId"`
	Room   HotelRoom `json:"room"`
	UserId uint      `json:"userId"`
	Date   time.Time `json:"date"`
}
