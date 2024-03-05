package controllers

import (
	"time"

	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/gofiber/fiber/v2"
)

func AddRoomToCart(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	roomId := uint(data["roomId"].(float64))
	userId := uint(data["userId"].(float64))

	layout := "2006-01-02"

	startDate, err := time.Parse(layout, data["startDate"].(string))
	if err != nil {
		return err
	}
	endDate, err := time.Parse(layout, data["endDate"].(string))
	if err != nil {
		return err
	}

	if startDate.Compare(endDate) >= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "End date must be after start date"})
	}
	if startDate.Compare(time.Now()) < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Start date cannot be in the past"})
	}
	if endDate.Compare(time.Now()) < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "End date cannot be in the past"})
	}

	hotelCart := models.HotelCart{
		RoomId:    roomId,
		UserId:    userId,
		StartDate: startDate,
		EndDate:   endDate,
	}

	database.DB.Create(&hotelCart)

	return c.JSON(fiber.Map{"message": "success"})
}

func GetRoomFromCart(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	userId := uint(data["userId"].(float64))

	var hotelCarts []models.HotelCart
	result := database.DB.Preload("Room.Hotel.City.Country").Where("user_id=?", userId).Where("status=?", "unpaid").Find(&hotelCarts)
	if result.Error != nil {
		return result.Error
	}

	return c.JSON(hotelCarts)
}

func UpdateRoomCart(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	bookingId := uint(data["bookingId"].(float64))

	layout := "2006-01-02"

	startDate, err := time.Parse(layout, data["startDate"].(string))
	if err != nil {
		return err
	}
	endDate, err := time.Parse(layout, data["endDate"].(string))
	if err != nil {
		return err
	}

	var roomCart models.HotelCart
	database.DB.Where("id=?", bookingId).First(&roomCart)
	roomCart.StartDate = startDate
	roomCart.EndDate = endDate

	if roomCart.Status == "paid" {
		return c.JSON(fiber.Map{"error": "This booking has been paid"})
	}

	if startDate.Compare(endDate) >= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "End date must be after start date"})
	}
	if startDate.Compare(time.Now()) < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Start date cannot be in the past"})
	}
	if endDate.Compare(time.Now()) < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "End date cannot be in the past"})
	}

	database.DB.Save(&roomCart)
	return c.JSON(fiber.Map{"message": "success"})
}

func DeleteRoomCart(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	bookingId := uint(data["bookingId"].(float64))

	var roomCart models.HotelCart
	database.DB.Where("id=?", bookingId).First(&roomCart)

	if roomCart.Status == "paid" {
		return c.JSON(fiber.Map{"error": "This booking has been paid"})
	}

	database.DB.Delete(&roomCart)

	return c.JSON(fiber.Map{"message": "success"})
}

func GetRoomFromOngoing(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	userId := uint(data["userId"].(float64))

	var hotelCarts []models.HotelCart
	result := database.DB.Preload("Room.Hotel.City.Country").
		Where("user_id=?", userId).
		Where("status=?", "paid").
		Where("start_date>?", time.Now()).
		Find(&hotelCarts)

	if result.Error != nil {
		return result.Error
	}

	return c.JSON(hotelCarts)
}

func GetRoomFromHistory(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	userId := uint(data["userId"].(float64))

	var hotelCarts []models.HotelCart
	result := database.DB.Preload("Room.Hotel.City.Country").
		Where("user_id=?", userId).
		Where("status=?", "paid").
		Where("start_date<?", time.Now()).
		Find(&hotelCarts)

	if result.Error != nil {
		return result.Error
	}

	return c.JSON(hotelCarts)
}
