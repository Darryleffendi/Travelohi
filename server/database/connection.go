package database

import (
	"fmt"

	"github.com/darryleffendi/travelHI/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dbUsername := "postgres"
	dbPassword := "admin"
	dbName := "TraveloHI"
	connStr := fmt.Sprintf("host=localhost user=%s database=%s password=%s sslmode=disable", dbUsername, dbName, dbPassword)
	connection, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	connection.AutoMigrate(
		&models.User{},
		&models.Promo{},
		&models.Country{},
		&models.City{},
		&models.Hotel{},
		&models.HotelRoom{},
		&models.Airline{},
		&models.PlaneModel{},
		&models.Plane{},
	)
	connection.AutoMigrate(
		&models.Flight{},
		&models.Seat{},
		&models.RoomBooking{},
		&models.Review{},
		&models.SeatCart{},
		&models.HotelCart{},
		&models.Otp{},
		&models.PromoUsage{},
	)

	DB = connection

	SeedDatabase(DB)
}
