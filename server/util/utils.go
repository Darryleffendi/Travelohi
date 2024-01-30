package util

import (
	"math/rand"
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
