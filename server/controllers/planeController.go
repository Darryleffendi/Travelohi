package controllers

import (
	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/gofiber/fiber/v2"
)

func GetPlane(c *fiber.Ctx) error {
	var planes []models.Plane
	database.DB.Preload("Airline").Preload("PlaneModel").Find(&planes)

	return c.JSON(planes)
}
