package database

import (
	"log"
	"math/rand"
	"time"

	"github.com/darryleffendi/travelHI/models"
	"github.com/darryleffendi/travelHI/util"
	"gorm.io/gorm"
)

func seedPlanes(db *gorm.DB) {
	planeModels := []models.PlaneModel{
		{Name: "737", Manufacturer: "Boeing", RowsAmount: 40, SeatsPerRow: 6},
		{Name: "747", Manufacturer: "Boeing", RowsAmount: 50, SeatsPerRow: 10},
		{Name: "A320", Manufacturer: "Airbus", RowsAmount: 30, SeatsPerRow: 6},
		{Name: "A330", Manufacturer: "Airbus", RowsAmount: 65, SeatsPerRow: 10},
	}

	for _, planeModel := range planeModels {
		err := db.Where(models.PlaneModel{Name: planeModel.Name}).FirstOrCreate(&planeModel).Error
		if err != nil {
			log.Printf("Could not seed PlaneModel: %v", err)
		}
	}

	airlines := []models.Airline{
		{Name: "Etihad Airways", ImageUrl: "./airlines/etihad.png"},
		{Name: "Emirates", ImageUrl: "./airlines/emirates.png"},
		{Name: "Air Asia", ImageUrl: "./airlines/airasia.png"},
		{Name: "Garuda Indonesia", ImageUrl: "./airlines/garuda.png"},
		{Name: "Lion Air", ImageUrl: "./airlines/lionair.png"},
	}

	for _, airline := range airlines {
		err := db.Where(models.PlaneModel{Name: airline.Name}).FirstOrCreate(&airline).Error
		if err != nil {
			log.Printf("Could not seed Airline: %v", err)
		}
	}

	// generatePlane(db)
}

func generatePlane(db *gorm.DB) {
	rand.Seed(time.Now().UnixNano())

	var airlines []models.Airline
	db.Find(&airlines)

	var planeModels []models.PlaneModel
	db.Find(&planeModels)

	airline := airlines[rand.Intn(len(airlines))]
	planeModel := planeModels[rand.Intn(len(planeModels))]

	plane := models.Plane{
		PlaneCode:    util.GenerateRandomCode(),
		PlaneModelId: planeModel.ID,
		PlaneModel:   planeModel,
		AirlineId:    airline.ID,
		Airline:      airline,
	}
	err := db.Where(models.Plane{PlaneCode: plane.PlaneCode}).FirstOrCreate(&plane).Error
	if err != nil {
		log.Printf("Could not seed Plane: %v", err)
	}
}
