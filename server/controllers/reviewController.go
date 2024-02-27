package controllers

import (
	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/darryleffendi/travelHI/util"
	"github.com/gofiber/fiber/v2"
)

func ReviewFromHotel(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	var reviews []models.Review
	database.DB.Preload("User").Where("hotel_id=?", data["id"]).Find(&reviews)
	return c.JSON(reviews)
}

func AddReview(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	if data["review"] == "" || data["rating"].(float64) <= 0 || data["rating"].(float64) > 5 {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Fill in all fields"})
	}

	if !util.ValidateCategory(data["category"].(string)) {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Invalid Category"})
	}

	review := models.Review{
		HotelId:     uint64(data["hotelId"].(float64)),
		Review:      data["review"].(string),
		ReviewType:  data["category"].(string),
		UserId:      uint64(data["userId"].(float64)),
		Rating:      uint64(data["rating"].(float64)),
		IsAnonymous: data["isAnonymous"].(bool),
	}

	database.DB.Create(&review)

	return c.JSON(fiber.Map{"message": "success"})
}
