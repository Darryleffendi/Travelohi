package util

import (
	"math/rand"
	"regexp"
	"strings"
	"time"
)

func RandomString(n int) string {
	const lettersAndDigits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var sb strings.Builder
	sb.Grow(n)

	rand.Seed(time.Now().UnixNano())

	for i := 0; i < n; i++ {
		index := rand.Intn(len(lettersAndDigits))
		sb.WriteByte(lettersAndDigits[index])
	}

	return sb.String()
}

func SanitizeName(name string) string {
	safeString := strings.ReplaceAll(name, " ", "_")

	reg := regexp.MustCompile(`[^a-zA-Z0-9_-]+`)
	safeString = reg.ReplaceAllString(safeString, "")

	return safeString
}

func GenerateRandomCode() string {
	rand.Seed(time.Now().UnixNano())

	letters := "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	digits := "0123456789"

	id := make([]byte, 6)

	for i := 0; i < 2; i++ {
		id[i] = letters[rand.Intn(len(letters))]
	}

	for i := 2; i < 6; i++ {
		id[i] = digits[rand.Intn(len(digits))]
	}

	return string(id)
}
