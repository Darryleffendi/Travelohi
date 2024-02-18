package database

import (
	"gorm.io/gorm"
)

func SeedDatabase(db *gorm.DB) {
	seedCities(db)
	seedPlanes(db)
	seedHotel(db)
	seedHotelRoom(db)
}
