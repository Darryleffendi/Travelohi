package models

import (
	"gorm.io/gorm"
)

type Plane struct {
	gorm.Model
	PlaneCode    string     `json:"planeCode"`
	PlaneModelId uint       `json:"planeModelId"`
	PlaneModel   PlaneModel `json:"planeModel" gorm:"foreignKey:PlaneModelId"`
	AirlineId    uint       `json:"airlineId"`
	Airline      Airline    `json:"airline" gorm:"foreignKey:AirlineId"`
}
