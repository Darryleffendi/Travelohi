package controllers

import (
	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/gofiber/fiber/v2"
)

func GetCities(c *fiber.Ctx) error {
	var city []models.City

	database.DB.Preload("Country").Find(&city)

	return c.JSON(city)
}

func GetCountries(c *fiber.Ctx) error {
	var country []models.Country

	database.DB.Find(&country)

	return c.JSON(country)
}

func GetCitiesFromCountry(c *fiber.Ctx) error {

	var data map[string]interface{}

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	countryName := data["countryName"]

	var country models.Country
	var city []models.City

	database.DB.Where("name=?", countryName).First(&country)
	database.DB.Where("country_id=?", country.ID).Find(&city)

	return c.JSON(city)
}

func GetCityFromName(cityName string) models.City {
	var city models.City
	database.DB.Preload("Country").Where("name=?", cityName).First(&city)
	return city
}
