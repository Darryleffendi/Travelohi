package controllers

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/darryleffendi/travelHI/util"
	"github.com/gofiber/fiber/v2"
)

func GetFlight(c *fiber.Ctx) error {

	var flights []models.Flight
	database.DB.Preload("DepartureCity.Country").Preload("ArrivalCity.Country").Preload("Plane.PlaneModel").Preload("Plane.Airline").Find(&flights)

	return c.JSON(flights)
}

func Flight(c *fiber.Ctx) error {
	var flight models.Flight
	var data map[string]interface{}

	c.BodyParser(&data)

	id, _ := strconv.ParseUint(data["id"].(string), 10, 64)
	database.DB.Preload("DepartureCity.Country").Preload("ArrivalCity.Country").Preload("Plane.PlaneModel").Preload("Plane.Airline").First(&flight, id)

	return c.JSON(flight)
}

func AddFlight(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	planeCode := data["planeCode"]
	plane := models.Plane{}

	database.DB.Preload("PlaneModel").Where("plane_code=?", planeCode).First(&plane)

	rowsAmount := plane.PlaneModel.RowsAmount
	seatsPerRow := plane.PlaneModel.SeatsPerRow

	seatingChart := make([][]models.Seat, rowsAmount)

	for i := range seatingChart {
		seatingChart[i] = make([]models.Seat, seatsPerRow)
	}

	for i := 0; i < rowsAmount; i++ {
		for j := 0; j < seatsPerRow; j++ {
			seatingChart[i][j].ColumnIndex = uint(j)
			seatingChart[i][j].RowIndex = uint(i)
			seatingChart[i][j].ID = 0
		}
	}

	seatingJson, _ := json.Marshal(seatingChart)
	price, _ := strconv.ParseFloat(data["price"].(string), 64)
	departureCityId, _ := strconv.ParseUint(data["departureCityId"].(string), 10, 64)
	arrivalCityId, _ := strconv.ParseUint(data["arrivalCityId"].(string), 10, 64)

	layout := "2006-01-02T15:04"

	// Parse the JavaScript date-time string to Go's time.Time
	departureTime, err := time.Parse(layout, data["departureTime"].(string))
	if err != nil {
		return err
	}
	arrivalTime, err := time.Parse(layout, data["arrivalTime"].(string))
	if err != nil {
		return err
	}

	flight := models.Flight{
		FlightNumber:    util.GenerateRandomCode(),
		SeatingChart:    string(seatingJson),
		PlaneId:         uint(data["planeId"].(float64)),
		Plane:           plane,
		Price:           price,
		DepartureCityId: uint(departureCityId),
		ArrivalCityId:   uint(arrivalCityId),
		DepartureTime:   departureTime,
		ArrivalTime:     arrivalTime,
	}

	database.DB.Create(&flight)
	return c.JSON(fiber.Map{"message": "success"})
}
