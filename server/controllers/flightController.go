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

	seatingChart := make([][]uint64, rowsAmount)

	for i := range seatingChart {
		seatingChart[i] = make([]uint64, seatsPerRow)
	}

	for i := 0; i < rowsAmount; i++ {
		for j := 0; j < seatsPerRow; j++ {
			seatingChart[i][j] = 1
		}
	}

	seatingJson, err := json.Marshal(seatingChart)
	if err != nil {
		return err
	}
	price, err := strconv.ParseFloat(data["price"].(string), 64)
	if err != nil {
		return err
	}
	departureCityId, err := strconv.ParseUint(data["departureCityId"].(string), 10, 64)
	if err != nil {
		return err
	}
	arrivalCityId, err := strconv.ParseUint(data["arrivalCityId"].(string), 10, 64)
	if err != nil {
		return err
	}

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

func SearchFlight(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	flights := []models.Flight{}

	baseQuery := database.DB.Preload("DepartureCity.Country").
		Preload("ArrivalCity.Country").
		Preload("Plane.PlaneModel").
		Preload("Plane.Airline")

	result := baseQuery.
		Joins("JOIN cities as arrival_cities ON flights.arrival_city_id = arrival_cities.id").
		Joins("JOIN countries ON arrival_cities.country_id = countries.id").
		Where("arrival_cities.name ILIKE ? OR countries.name ILIKE ?", "%"+data["query"].(string)+"%", "%"+data["query"].(string)+"%").
		Find(&flights)

	if result.Error != nil {
		return result.Error
	}

	return c.JSON(flights)
}
