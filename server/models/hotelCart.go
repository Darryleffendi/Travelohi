package models

import (
	"time"

	"gorm.io/gorm"
)

type HotelCart struct {
	gorm.Model
	RoomId       uint      `json:"roomId"`
	Room         HotelRoom `json:"room" gorm:"foreignKey:RoomId"`
	UserId       uint      `json:"userId"`
	Status       string    `json:"status" gorm:"default:'unpaid'"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
	RoomBookings string    `json:"roomBookings"` // JSON RoomBooking[]
}
