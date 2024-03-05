package controllers

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/gofiber/fiber/v2"
)

func AddSeatToCart(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	userId := uint(data["userId"].(float64))
	flightId := uint(data["flightId"].(float64))

	var baggage uint64

	if value, ok := data["baggage"].(float64); ok {
		baggage = uint64(value)
	} else {
		baggage, _ = strconv.ParseUint(data["baggage"].(string), 10, 32)
	}
	seatsJson := data["seats"].(string)

	seatCart := models.SeatCart{
		UserId:   userId,
		FlightId: flightId,
		Seats:    seatsJson,
		Baggage:  uint(baggage),
	}

	var seats []map[string]uint

	json.Unmarshal([]byte(seatsJson), &seats)

	if len(seats) == 0 {
		return c.JSON(fiber.Map{"error": "Please Select Seats"})
	}

	var flight models.Flight
	result := database.DB.Where("id=?", flightId).First(&flight, flightId)
	if result.Error != nil {
		return c.JSON(fiber.Map{"error": "Flight ID is not valid"})
	}

	var flightSeats [][]uint
	json.Unmarshal([]byte(flight.SeatingChart), &flightSeats)

	// Loop through seats array
	for _, seat := range seats {
		if flightSeats[seat["rowIndex"]][seat["columnIndex"]] != 1 {
			return c.JSON(fiber.Map{"error": "Seat has been taken"})
		}
	}

	result2 := database.DB.Create(&seatCart)
	if result2.Error != nil {
		return result.Error
	}

	return c.JSON(fiber.Map{"message": "success"})
}

func GetSeatFromCart(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	userId := uint(data["userId"].(float64))

	var seatCarts []models.SeatCart
	result := database.DB.Preload("Flight.DepartureCity.Country").Preload("Flight.ArrivalCity.Country").Preload("Flight.Plane.PlaneModel").Where("user_id=?", userId).Where("status=?", "unpaid").Find(&seatCarts)
	if result.Error != nil {
		return result.Error
	}

	return c.JSON(seatCarts)
}

func BookSeat(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	userId := uint(data["userId"].(float64))
	flightId := uint(data["flightId"].(float64))
	seatsJson := data["seats"].(string)

	var seats []map[string]interface{}
	var flightSeats [][]uint
	var flight models.Flight

	database.DB.First(&flight, flightId)

	if err := json.Unmarshal([]byte(seatsJson), &seats); err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
	}
	if err := json.Unmarshal([]byte(flight.SeatingChart), &flightSeats); err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
	}

	for _, v := range seats {
		seat := models.Seat{
			UserId:      userId,
			FlightId:    flightId,
			RowIndex:    uint(v["rowIndex"].(float64)),
			ColumnIndex: uint(v["columnIndex"].(float64)),
		}
		result := database.DB.Create(&seat)
		if result.Error != nil {
			return result.Error
		}

		flightSeats[seat.RowIndex][seat.ColumnIndex] = seat.ID
	}

	flightSeatsJson, _ := json.Marshal(flightSeats)
	flight.SeatingChart = string(flightSeatsJson)
	database.DB.Save(&flight)

	return c.JSON(fiber.Map{"message": "success"})
}

func DeleteSeatCart(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	seatId := uint(data["seatId"].(float64))

	var seatCart models.SeatCart
	database.DB.Where("id=?", seatId).First(&seatCart)

	if seatCart.Status == "paid" {
		return c.JSON(fiber.Map{"error": "This seat has been paid"})
	}

	database.DB.Delete(&seatCart)

	return c.JSON(fiber.Map{"message": "success"})
}

func GetSeatFromOngoing(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	userId := uint(data["userId"].(float64))

	var seatCarts []models.SeatCart
	result := database.DB.Preload("Flight.DepartureCity.Country").Preload("Flight.ArrivalCity.Country").Preload("Flight.Plane.PlaneModel").
		Joins("join flights on flights.id = seat_carts.flight_id").
		Where("user_id=?", userId).
		Where("status=?", "paid").
		Where("flights.departure_time > ?", time.Now()).
		Find(&seatCarts)

	if result.Error != nil {
		return result.Error
	}

	return c.JSON(seatCarts)
}

func GetSeatFromHistory(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	userId := uint(data["userId"].(float64))

	var seatCarts []models.SeatCart
	result := database.DB.Preload("Flight.DepartureCity.Country").Preload("Flight.ArrivalCity.Country").Preload("Flight.Plane.PlaneModel").
		Joins("join flights on flights.id = seat_carts.flight_id").
		Where("user_id=?", userId).
		Where("status=?", "paid").
		Where("flights.departure_time < ?", time.Now()).
		Find(&seatCarts)

	if result.Error != nil {
		return result.Error
	}

	return c.JSON(seatCarts)
}
