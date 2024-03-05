package database

import (
	"encoding/json"
	"log"
	"time"

	"github.com/darryleffendi/travelHI/models"
	"github.com/darryleffendi/travelHI/util"
	"gorm.io/gorm"
)

func seedFlights(db *gorm.DB) {

	var count int64
	var flight models.Flight

	db.Model(&flight).Count(&count)

	if count == 0 {
		var plane models.Plane
		var departureCity models.City
		var arrivalCity models.City

		db.First(&plane)
		db.First(&departureCity)
		db.Last(&arrivalCity)

		flight = models.Flight{
			FlightNumber: util.GenerateRandomCode(),
			// SeatingChart:    string(seatingJson),
			PlaneId:         plane.ID,
			Price:           600,
			DepartureCityId: departureCity.ID,
			ArrivalCityId:   arrivalCity.ID,
			DepartureTime:   time.Now().Add(time.Hour * 48),
			ArrivalTime:     time.Now().Add(time.Hour * 60),
		}

		result := db.Create(&flight)
		if result.Error != nil {
			log.Fatal(result.Error)
		}
	}

	var seat models.Seat

	db.Preload("Plane.PlaneModel").First(&flight)
	db.Model(&seat).Where("id=?", 1).Count(&count)

	if count == 0 {
		res2 := db.Exec("ALTER SEQUENCE seats_id_seq RESTART WITH 1")
		if res2.Error != nil {
			log.Fatal(res2.Error)
		}

		seat := models.Seat{
			FlightId:    flight.ID,
			UserId:      0,
			RowIndex:    0,
			ColumnIndex: 0,
		}

		result := db.Create(&seat)
		if result.Error != nil {
			log.Fatal(result.Error)
		}
	} else {
		db.Where("id=?", 1).First(&seat)
	}

	if flight.SeatingChart == "" {

		rowsAmount := flight.Plane.PlaneModel.RowsAmount
		seatsPerRow := flight.Plane.PlaneModel.SeatsPerRow

		seatingChart := make([][]uint64, rowsAmount)

		for i := range seatingChart {
			seatingChart[i] = make([]uint64, seatsPerRow)
		}

		for i := 0; i < rowsAmount; i++ {
			for j := 0; j < seatsPerRow; j++ {
				seatingChart[i][j] = 1
			}
		}

		seatingJson, _ := json.Marshal(seatingChart)

		flight.SeatingChart = string(seatingJson)
		result := db.Save(&flight)
		if result.Error != nil {
			log.Fatal(result.Error)
		}
	}
}
