package controllers

import (
	"fmt"

	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/gofiber/fiber/v2"
)

func AddPromo(c *fiber.Ctx) error {
	file, err := c.FormFile("uploadedImage")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Image upload error"})
	}
	c.SaveFile(file, "public/promo/"+file.Filename)

	title := c.FormValue("title")
	discount := c.FormValue("discount")
	promoCode := c.FormValue("promoCode")
	validFrom := c.FormValue("validFrom")
	validUntil := c.FormValue("validUntil")

	imageUrl := "public/promo/" + file.Filename
	if title == "" || discount == "" || promoCode == "" || validFrom == "" || validUntil == "" || imageUrl == "" {
		fmt.Println("Empty Data")
		return c.Status(400).JSON(map[string]string{"error": "All fields are required"})
	}

	promo := models.Promo{
		Title:      title,
		Discount:   discount,
		PromoCode:  promoCode,
		ValidFrom:  validFrom,
		ValidUntil: validUntil,
		ImageUrl:   imageUrl,
	}
	database.DB.Create(&promo)

	return c.Status(200).JSON(map[string]string{"message": "success"})
}

func GetPromo(c *fiber.Ctx) error {
	var promo []models.Promo

	database.DB.Find(&promo)

	return c.JSON(promo)
}
