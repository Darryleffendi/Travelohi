package controllers

import (
	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/gofiber/fiber/v2"
)

func GetFlight(c *fiber.Ctx) error {

	var flights []models.Flight
	database.DB.Preload("DepartureCity.Country").Preload("ArrivalCity.Country").Preload("Plane.PlaneModel").Preload("Plane.Airline").Find(&flights)

	return c.JSON(flights)
}
