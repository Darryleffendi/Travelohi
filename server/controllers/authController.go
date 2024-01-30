package controllers

import (
	"fmt"
	"strconv"

	"time"

	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "secret"

func Register(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	// receiveEmail, err := strconv.ParseBool(data["emailList"])

	// if (err) != nil {
	// 	return err
	// }

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	user := models.User{
		FirstName:        data["firstName"],
		LastName:         data["lastName"],
		Email:            data["email"],
		Password:         string(password),
		Gender:           data["gender"],
		BirthDate:        data["dob"],
		ReceiveEmail:     true,
		SecurityQuestion: data["securityQuestion"],
		SecurityAnswer:   data["securityAnswer"],
	}

	database.DB.Create(&user)

	subject := fmt.Sprintf("Welcome Aboard, %s! Your Adventure Awaits", data["firstName"])
	body := fmt.Sprintf("Dear %s,\n\nYou've successfully created an account with us! Welcome to TraveloHI, where your next great journey begins. We're thrilled to have you onboard.\n\nAs a valued member, you now have the world at your fingertips. From soaring through the skies with our exclusive flight deals to finding your home away from home with our wide range of hotel bookings, your travel dreams are just a few clicks away.\n\nWhat's Next?\n\nPersonalize Your Experience: Tailor your preferences for tailored recommendations that suit your wanderlust.\nExclusive Deals: Keep an eye on your inbox for special offers, available only to our members.\nSeamless Bookings: Enjoy our user-friendly platform for hassle-free flight and hotel reservations.\nNeed inspiration for your next adventure? Visit our blog for travel tips, destination guides, and more.\n\nWe're here to assist you every step of the way. For any questions or assistance, feel free to reach out to our customer support team.\nBuckle up, %s, your journey with TraveloHI is about to take off. Let’s make unforgettable memories together!\n\nHappy Travels,\nThe TraveloHI Team\n\nP.S. Don't forget to follow us on social media for the latest travel buzz!", data["firstName"], data["firstName"])

	sendMail(data["email"], subject, body)

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email =?", data["email"]).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{"error": "User not found"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error": "Invalid email or password"})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{"error": "Could not login"})
	}

	cookie := fiber.Cookie{
		Name:  "jwt",
		Value: token,
		//Expires:  time.Now().Add(time.Hour * 24 * 7),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		// c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{"error": token})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	database.DB.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
