package models

import (
	"time"

	"gorm.io/gorm"
)

type Flight struct {
	gorm.Model
	SeatingChart    string    `json:"seatingChart"`
	PlaneId         uint      `json:"planeId"`
	Plane           Plane     `json:"plane" gorm:"foreignKey:PlaneId"`
	Price           float64   `json:"price"`
	DepartureCityId uint      `json:"departureCityId"`
	DepartureCity   City      `json:"departureCity" gorm:"foreignKey:DepartureCityId"`
	ArrivalCityId   uint      `json:"arrivalCityId"`
	ArrivalCity     City      `json:"arrivalCity" gorm:"foreignKey:ArrivalCityId"`
	DepartureTime   time.Time `json:"departureTime"`
	ArrivalTime     time.Time `json:"arrivalTime"`
}
