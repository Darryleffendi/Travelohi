package controllers

import (
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

func UpdatePromo(c *fiber.Ctx) error {

	title := c.FormValue("title")
	discount := c.FormValue("discount")
	promoCode := c.FormValue("promoCode")
	validFrom := c.FormValue("validFrom")
	validUntil := c.FormValue("validUntil")
	promoId := c.FormValue("promoId")

	if title == "" || discount == "" || promoCode == "" || validFrom == "" || validUntil == "" {
		return c.Status(400).JSON(map[string]string{"error": "All fields are required"})
	}

	var promo models.Promo
	database.DB.Where("id =?", promoId).First(&promo)

	promo.Title = title
	promo.Discount = discount
	promo.PromoCode = promoCode
	promo.ValidFrom = validFrom
	promo.ValidUntil = validUntil
	database.DB.Save(&promo)

	return c.Status(200).JSON(map[string]string{"message": "success"})
}

func GetPromo(c *fiber.Ctx) error {
	var promo []models.Promo

	database.DB.Find(&promo)

	return c.JSON(promo)
}

func Promo(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	promoCode := data["promoCode"].(string)

	var promo models.Promo

	result := database.DB.Where("promo_code= ?", promoCode).First(&promo)
	if result.Error != nil {
		return c.Status(404).JSON(map[string]string{"error": "Promo code not found"})
	}

	var count int64

	database.DB.Model(&models.PromoUsage{}).Where("promo_code=?", promoCode).Count(&count)

	if count > 0 {
		return c.JSON(fiber.Map{"error": "Promo has been used"})
	}

	return c.JSON(promo)
}
