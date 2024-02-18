package controllers

import (
	"fmt"
	"net/smtp"
)

func sendMail(receiver string, subject string, body string) {
	auth := smtp.PlainAuth(
		"TraveloHI",
		"darrylchristopherefendi@gmail.com",
		"prnqyvpbpwnxizje",
		"smtp.gmail.com",
	)

	message := fmt.Sprintf("Subject: %s\n%s", subject, body)

	err := smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		"darrylchristopherefendi@gmail.com",
		[]string{receiver},
		[]byte(message),
	)

	if err != nil {
		fmt.Println(err)
	}
}
