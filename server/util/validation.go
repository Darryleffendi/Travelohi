package util

import (
	"regexp"
	"strings"
	"time"
)

func ValidatePassword(password string) bool {
	lowercaseRegex := regexp.MustCompile(`[a-z]`)
	uppercaseRegex := regexp.MustCompile(`[A-Z]`)
	numberRegex := regexp.MustCompile(`[0-9]`)
	symbolRegex := regexp.MustCompile(`[!@#$%^&*(),.?":{}|<>]`)

	hasLowercase := lowercaseRegex.MatchString(password)
	hasUppercase := uppercaseRegex.MatchString(password)
	hasNumber := numberRegex.MatchString(password)
	hasSymbol := symbolRegex.MatchString(password)
	passwordLength := len(password)

	return hasLowercase && hasUppercase && hasNumber && hasSymbol && passwordLength >= 8 && passwordLength <= 30
}

func ValidateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$`)
	return emailRegex.MatchString(email) && strings.HasSuffix(email, ".com")
}

func ValidateName(name string) bool {
	lettersRegex := regexp.MustCompile(`^[a-zA-Z]+$`)
	return len(name) >= 5 && lettersRegex.MatchString(name)
}

func CalculateAge(dateOfBirth time.Time) int {
	now := time.Now()

	age := now.Year() - dateOfBirth.Year()

	if now.Month() < dateOfBirth.Month() || (now.Month() == dateOfBirth.Month() && now.Day() < dateOfBirth.Day()) {
		age--
	}

	return age
}

func ValidateQuestion(question string) bool {

	validQuestions := []string{
		"What is your favorite childhood pet's name?",
		"In which city where you born?",
		"What is the name of your favorite book or movie?",
		"What is the name of the elementary school you attended?",
		"What is the model of your first car?",
	}

	for _, b := range validQuestions {
		if b == question {
			return true
		}
	}
	return false
}
