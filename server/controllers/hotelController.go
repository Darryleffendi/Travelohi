package controllers

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/darryleffendi/travelHI/util"
	"github.com/gofiber/fiber/v2"
)

func AddHotel(c *fiber.Ctx) error {

	/* ------ Create Hotel Directory ------ */
	name := c.FormValue("name")

	dirName := util.SanitizeName(name)
	dirPath := filepath.Join("public/hotel", dirName)

	if err := os.MkdirAll(dirPath, 0755); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create directory"})
	}

	/* ------ Parse Multi Images ------ */
	var imagesUrl []string

	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse multipart form"})
	}

	files := form.File["images"]

	for _, file := range files {
		// Save the files to the server
		savePath := filepath.Join(dirPath, filepath.Base(file.Filename))
		if err := c.SaveFile(file, savePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save file"})
		} else {
			imagesUrl = append(imagesUrl, savePath)
		}
	}

	/* ------ Parse Single Image ------ */

	file, err := c.FormFile("frontImage")
	if err != nil {
		fmt.Println("Error retrieving frontImage:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Image upload error"})
	}
	frontImagePath := filepath.Join(dirPath, filepath.Base(file.Filename))

	if err := c.SaveFile(file, frontImagePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save front image"})
	}

	/* ------ Insert to Database ------ */

	description := c.FormValue("description")
	address := c.FormValue("address")
	facilities := c.FormValue("facilities")
	cityName := c.FormValue("city")
	city := GetCityFromName(cityName)

	if name == "" || description == "" || address == "" || cityName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing required parameters"})
	}

	imagesJson, err := json.Marshal(imagesUrl)
	if err != nil {
		fmt.Printf("Error occurred during marshaling. Error: %s", err.Error())
	}

	hotel := models.Hotel{
		Description: description,
		Address:     address,
		Facilities:  facilities,
		Name:        name,
		City:        city,
		CityId:      city.ID,
		ImageUrl:    frontImagePath,
		ImageUrls:   string(imagesJson),
	}

	database.DB.Create(&hotel)

	return c.JSON(fiber.Map{
		"id":   hotel.ID,
		"path": dirPath,
	})
}

func GetHotel(c *fiber.Ctx) error {
	hotels := []models.Hotel{}
	database.DB.Preload("City.Country").Find(&hotels)
	return c.JSON(hotels)
}

func Hotel(c *fiber.Ctx) error {
	var data map[string]interface{}

	c.BodyParser(&data)

	id, _ := strconv.ParseUint(data["id"].(string), 10, 64)
	hotel := models.Hotel{}
	database.DB.Preload("City.Country").First(&hotel, id)

	return c.JSON(hotel)
}

func AddRoom(c *fiber.Ctx) error {

	/* ------ Create Room Directory ------ */
	name := c.FormValue("name")
	path := c.FormValue("path")

	dirName := util.SanitizeName(name)
	dirPath := filepath.Join(path, dirName)

	if err := os.MkdirAll(dirPath, 0755); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create directory"})
	}

	/* ------ Parse Multi Images ------ */

	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse multipart form"})
	}

	files := form.File["images"]
	var imagesUrl []string

	for _, file := range files {
		// Save the files to the server
		savePath := filepath.Join(dirPath, filepath.Base(file.Filename))
		if err := c.SaveFile(file, savePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save file"})
		} else {
			imagesUrl = append(imagesUrl, savePath)
		}
	}

	price, _ := strconv.ParseFloat(c.FormValue("price"), 64)
	bedType := c.FormValue("bedType")
	facilities := c.FormValue("facilities")
	hotelId, _ := strconv.ParseUint(c.FormValue("hotelId"), 10, 64)
	guests, _ := strconv.ParseUint(c.FormValue("guests"), 10, 64)
	hotel := GetHotelFromId(hotelId)

	imagesJson, err := json.Marshal(imagesUrl)
	if err != nil {
		fmt.Printf("Error occurred during marshaling. Error: %s", err.Error())
	}

	room := models.HotelRoom{
		Price:      price,
		BedType:    bedType,
		Name:       name,
		Facilities: facilities,
		HotelId:    hotelId,
		Hotel:      hotel,
		ImageUrls:  string(imagesJson),
		Guests:     guests,
	}

	database.DB.Create(&room)

	return c.JSON(fiber.Map{
		"message": "Success Inserting Data",
	})
}

func GetHotelFromId(id uint64) models.Hotel {
	var hotel models.Hotel
	database.DB.Preload("City.Country").Where("id=?", id).First(&hotel)
	return hotel
}

func GetRoomFromHotel(hotelId uint64) []models.HotelRoom {

	var rooms []models.HotelRoom
	database.DB.Preload("Hotel").Where("hotel_id=?", hotelId).Find(&rooms)
	return rooms
}

func RoomFromHotel(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	var rooms []models.HotelRoom
	database.DB.Preload("Hotel").Where("hotel_id=?", data["id"]).Find(&rooms)
	return c.JSON(rooms)
}

func SearchHotel(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	hotels := []models.Hotel{}
	result := database.DB.Preload("City.Country").Where("name ILIKE ?", "%"+data["query"].(string)+"%").Find(&hotels)

	if result.Error != nil {
		return result.Error
	}

	return c.JSON(hotels)
}
