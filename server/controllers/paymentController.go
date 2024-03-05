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

func CheckoutCart(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	hotelCartJson := data["hotelCart"].(string)
	flightCartJson := data["flightCart"].(string)
	userId := data["userId"].(string)
	promoCode := data["promoCode"].(string)
	paymentMethod := data["paymentMethod"].(string)
	totalPrice := data["totalPrice"].(float64)

	var hotelCart []map[string]interface{}
	var flightCart []map[string]interface{}

	var promo models.Promo

	json.Unmarshal([]byte(hotelCartJson), &hotelCart)
	json.Unmarshal([]byte(flightCartJson), &flightCart)

	print(userId)
	print(paymentMethod)

	var user models.User
	database.DB.Where("id=?", userId).First(&user)

	if len(hotelCart) == 0 && len(flightCart) == 0 {
		return c.JSON(fiber.Map{"error": "Cart is empty"})
	}

	if paymentMethod == "" {
		return c.JSON(fiber.Map{"error": "Please select a payment method"})
	}

	// Validate Promo
	if promoCode != "" {
		result := database.DB.Where("promo_code= ?", promoCode).First(&promo)
		if result.Error != nil {
			return c.Status(404).JSON(map[string]string{"error": "Promo code not found"})
		}

		var count int64

		database.DB.Model(&models.PromoUsage{}).Where("promo_code=?", promoCode).Count(&count)

		if count > 0 {
			return c.JSON(fiber.Map{"error": "Promo has been used"})
		}
	}

	var payment string

	// Validate Payment
	if paymentMethod == "0" {
		payment = "TraveloHI Wallet"
		if user.WalletBalance < uint64(totalPrice) {
			return c.Status(404).JSON(map[string]string{"error": "Insufficient balance"})
		}
	} else {
		payment = "Credit Card"
		if user.CardNumber == "" {
			return c.Status(404).JSON(map[string]string{"error": "Please add a credit card"})
		}
	}

	// Change Hotel Cart Status
	for _, hotel := range hotelCart {

		var dbHotel models.HotelCart
		result := database.DB.Preload("Room.Hotel.City.Country").
			First(&dbHotel, hotel["ID"])

		// Validate Check in date
		if dbHotel.StartDate.Compare(dbHotel.EndDate) >= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "End date must be after start date"})
		}
		if dbHotel.StartDate.Compare(time.Now()) < 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Start date cannot be in the past"})
		}
		if dbHotel.EndDate.Compare(time.Now()) < 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "End date cannot be in the past"})
		}

		if result.Error != nil {
			// If cart does not exist

		} else {
			// If cart exists
			dbHotel.Status = "paid"
			database.DB.Save(&dbHotel)

			for d := dbHotel.StartDate; d.Before(dbHotel.EndDate) || d.Equal(dbHotel.EndDate); d = d.AddDate(0, 0, 1) {
				var roomBooking models.RoomBooking
				roomBooking.RoomId = dbHotel.RoomId
				roomBooking.UserId = dbHotel.UserId
				roomBooking.Date = d
				database.DB.Create(&roomBooking)
			}
		}

		subject := fmt.Sprintf("Confirmation of Hotel Booking with TraveloHI")
		body := fmt.Sprintf("Dear %s,\n\nWe are delighted to confirm your hotel booking through TraveloHI. Your reservation details are as follows:\n\nHotel Name: %s\nRoom Type: %s\nCheck-in Date: %s\nCheck-out Date: %s\n\nPayment Method: %s\n\nWe would like to thank you for choosing TraveloHI for your accommodation needs. Your booking is now confirmed, and you can look forward to a wonderful stay at %s\n\nShould you have any questions or require further assistance, please do not hesitate to contact our customer support team.\n\nWe wish you a fantastic travel experience with TraveloHI and hope you enjoy your stay at %s.\n\nWarm Regards,\n\nCustomer Service Team\nTraveloHI", user.FirstName, dbHotel.Room.Hotel.Name, dbHotel.Room.Name, dbHotel.StartDate, dbHotel.EndDate, payment, dbHotel.Room.Hotel.Name, dbHotel.Room.Hotel.Name)

		sendMail(user.Email, subject, body)
	}

	// Change Flight Cart Status
	for _, flight := range flightCart {
		var dbSeat models.SeatCart
		result := database.DB.First(&dbSeat, flight["ID"])

		var seats []models.Seat
		json.Unmarshal([]byte(flight["seats"].(string)), &seats)

		var dbFlight models.Flight
		database.DB.Preload("DepartureCity.Country").Preload("ArrivalCity.Country").
			First(&dbFlight, flight["flightId"])

		if dbFlight.DepartureTime.Compare(time.Now()) <= 0 {
			return c.Status(404).JSON(map[string]string{"error": "Flight has already departed"})
		}

		var flightSeats [][]uint
		if err := json.Unmarshal([]byte(dbFlight.SeatingChart), &flightSeats); err != nil {
			fmt.Println("Error unmarshalling JSON:", err)
		}

		if result.Error != nil {
			// If cart does not exist

		} else {
			// If cart exists
			dbSeat.Status = "paid"
			database.DB.Save(&dbSeat)

			for _, seat := range seats {
				seat.FlightId = uint(flight["flightId"].(float64))
				intUserId, _ := strconv.Atoi(userId)
				seat.UserId = uint(intUserId)

				flightSeats[seat.RowIndex][seat.ColumnIndex] = seat.ID

				result := database.DB.Create(&seat)
				if result.Error != nil {
					return result.Error
				}
			}
		}

		flightSeatsJson, _ := json.Marshal(flightSeats)
		dbFlight.SeatingChart = string(flightSeatsJson)
		database.DB.Save(&dbFlight)

		subject := fmt.Sprintf("Flight Booking Confirmation with TraveloHI")
		body := fmt.Sprintf("Dear %s,\n\nWe are thrilled to confirm your flight booking through TraveloHI. Here are the details of your reservation:\n\nDeparture Airport: %s\nDestination Airport: %s\nDeparture Date: %s\nArrival Date: %s\n\nFlight Number: %s\nPayment Method: %s\n\nThank you for choosing TraveloHI for your travel needs. Your flight booking is now confirmed, and we look forward to providing you with a seamless travel experience.\n\nIf you have any questions or need further assistance, please feel free to reach out to our customer support team\n\nSafe travels and enjoy your flight with TraveloHI!\n\nBest regards,\n\nCustomer Service Team\nTraveloHI", user.FirstName, dbFlight.DepartureCity.AirportName, dbFlight.ArrivalCity.AirportName, dbFlight.DepartureTime, dbFlight.ArrivalTime, dbFlight.FlightNumber, payment)

		sendMail(user.Email, subject, body)
	}

	if paymentMethod == "0" {
		user.WalletBalance -= uint64(totalPrice)
	}
	promoUsage := models.PromoUsage{
		UserId:    user.ID,
		PromoCode: promoCode,
	}

	database.DB.Create(&promoUsage)
	database.DB.Save(&user)

	return c.JSON(fiber.Map{"message": "success"})
}
