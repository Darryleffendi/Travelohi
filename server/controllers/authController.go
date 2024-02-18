package controllers

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"time"

	"github.com/darryleffendi/travelHI/database"
	"github.com/darryleffendi/travelHI/models"
	"github.com/darryleffendi/travelHI/util"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "secret"

func Register(c *fiber.Ctx) error {

	file, err := c.FormFile("imageUrl")
	if err != nil {
		fmt.Println("Error retrieving frontImage:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Image upload error"})
	}

	firstName := c.FormValue("firstName")
	lastName := c.FormValue("lastName")
	email := c.FormValue("email")
	gender := c.FormValue("gender")
	dob := c.FormValue("dob")
	parsedDate, err := time.Parse("2006-01-02", dob)
	if err != nil {
		return c.Status(400).JSON(map[string]string{"error": err.Error()})
	}
	receiveEmail := c.FormValue("emailList") == "true"
	securityQuestion := c.FormValue("securityQuestion")
	securityAnswer := c.FormValue("securityAnswer")

	password, _ := bcrypt.GenerateFromPassword([]byte(c.FormValue("password")), 14)

	fileName := util.SanitizeName(firstName+"-"+email) + filepath.Ext(file.Filename)
	dirPath := filepath.Join("public/profile-picture")
	filePath := filepath.Join(dirPath, fileName)

	if err := os.MkdirAll(dirPath, 0755); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create directory"})
	}

	if err := c.SaveFile(file, filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save front image"})
	}

	user := models.User{
		FirstName:        firstName,
		LastName:         lastName,
		Email:            email,
		Password:         string(password),
		Gender:           gender,
		BirthDate:        parsedDate,
		ReceiveEmail:     receiveEmail,
		SecurityQuestion: securityQuestion,
		SecurityAnswer:   securityAnswer,
		ImageUrl:         filePath,
	}

	if user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" || user.Gender == "" || user.SecurityQuestion == "" || user.SecurityAnswer == "" {
		return c.Status(400).JSON(map[string]string{"error": "Please fill all fields"})
	}
	if !util.ValidatePassword(c.FormValue("confirmPassword")) {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Password"})
	}
	if c.FormValue("password") != c.FormValue("confirmPassword") {
		return c.Status(400).JSON(map[string]string{"error": "Password Does Not Match"})
	}
	if !(util.ValidateName(user.FirstName) && util.ValidateName(user.LastName)) {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Name"})
	}
	if !util.ValidateEmail(user.Email) {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Email"})
	}
	if user.Gender != "male" && user.Gender != "female" && user.Gender != "Male" && user.Gender != "Female" {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Gender"})
	}
	if util.CalculateAge(user.BirthDate) < 13 {
		return c.Status(400).JSON(map[string]string{"error": "You must be atleast 13 years old to register"})
	}
	if !util.ValidateQuestion(user.SecurityQuestion) {
		return c.Status(400).JSON(map[string]string{"error": "Invalid Question"})
	}

	database.DB.Create(&user)

	subject := fmt.Sprintf("Welcome Aboard, %s! Your Adventure Awaits", firstName)
	body := fmt.Sprintf("Dear %s,\n\nYou've successfully created an account with us! Welcome to TraveloHI, where your next great journey begins. We're thrilled to have you onboard.\n\nAs a valued member, you now have the world at your fingertips. From soaring through the skies with our exclusive flight deals to finding your home away from home with our wide range of hotel bookings, your travel dreams are just a few clicks away.\n\nWhat's Next?\n\nPersonalize Your Experience: Tailor your preferences for tailored recommendations that suit your wanderlust.\nExclusive Deals: Keep an eye on your inbox for special offers, available only to our members.\nSeamless Bookings: Enjoy our user-friendly platform for hassle-free flight and hotel reservations.\nNeed inspiration for your next adventure? Visit our blog for travel tips, destination guides, and more.\n\nWe're here to assist you every step of the way. For any questions or assistance, feel free to reach out to our customer support team.\nBuckle up, %s, your journey with TraveloHI is about to take off. Let’s make unforgettable memories together!\n\nHappy Travels,\nThe TraveloHI Team\n\nP.S. Don't forget to follow us on social media for the latest travel buzz!", firstName, firstName)

	sendMail(email, subject, body)

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

func GetUser(c *fiber.Ctx) error {
	var users []models.User

	database.DB.Find(&users)

	return c.JSON(users)
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
