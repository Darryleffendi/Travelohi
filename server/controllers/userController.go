package controllers

import (
	"time"

	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/darryleffendi/travelHI/util"
	"github.com/gofiber/fiber/v2"
)

func UpdateUser(c *fiber.Ctx) error {

	firstName := c.FormValue("firstName")
	lastName := c.FormValue("lastName")
	email := c.FormValue("email")
	address := c.FormValue("address")
	phoneNumber := c.FormValue("phoneNumber")
	dob := c.FormValue("dob")
	userId := c.FormValue("ID")
	receiveEmail := c.FormValue("receiveEmail") == "true"
	cardHolder := c.FormValue("cardHolder")
	cardNumber := c.FormValue("cardNumber")
	cardExpiry := c.FormValue("cardExpiry")
	cardCvv := c.FormValue("cardCvv")
	parsedDate, err := time.Parse("2006-01-02", dob)
	if err != nil {
		return c.Status(400).JSON(map[string]string{"error": err.Error()})
	}

	var user models.User
	database.DB.Where("id =?", userId).First(&user)

	user.FirstName = firstName
	user.LastName = lastName
	user.Email = email
	user.BirthDate = parsedDate
	user.ReceiveEmail = receiveEmail
	user.PhoneNumber = phoneNumber
	user.Email = email
	user.Address = address
	user.CardHolder = cardHolder
	user.CardNumber = cardNumber
	user.CardExpiry = cardExpiry
	user.CardCvv = cardCvv

	if user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" || user.Gender == "" || user.SecurityQuestion == "" || user.SecurityAnswer == "" {
		return c.Status(400).JSON(map[string]string{"error": "Please fill all fields"})
	}
	if !(util.ValidateName(user.FirstName) && util.ValidateName(user.LastName)) {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Name"})
	}
	if !util.ValidateEmail(user.Email) {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Email"})
	}
	if util.CalculateAge(user.BirthDate) < 13 {
		return c.Status(400).JSON(map[string]string{"error": "You must be atleast 13 years old to register"})
	}
	if parsedDate.Compare(time.Now()) > 0 {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Date of Birth"})
	}
	if user.CardHolder == "" || user.CardNumber == "" || user.CardExpiry == "" || user.CardCvv == "" {
		return c.Status(400).JSON(map[string]string{"error": "Please fill in your payment details"})
	}
	if len(user.CardNumber) != 16 && len(user.CardNumber) != 19 {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Card Number"})
	}

	database.DB.Save(&user)

	return c.JSON(user)
}

func GetUsers(c *fiber.Ctx) error {
	var users []models.User
	database.DB.Find(&users)
	return c.JSON(users)
}

func BanUser(c *fiber.Ctx) error {
	userId := c.FormValue("ID")
	banned := c.FormValue("banned") == "true"

	var user models.User
	database.DB.Where("id=?", userId).Find(&user)
	user.Banned = banned
	database.DB.Save(&user)
	return c.JSON(fiber.Map{"message": "success"})
}

func SendMailToUsers(c *fiber.Ctx) error {
	var data map[string]interface{}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	subject := data["subject"].(string)
	body := data["body"].(string)

	if subject == "" || body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Please fill in all fields"})
	}

	var users []models.User
	database.DB.Find(&users)

	for _, user := range users {
		if !user.Banned {
			sendMail(user.Email, subject, body)
		}
	}
	return c.JSON(fiber.Map{"message": "success"})
}
