package routes

import (
	"github.com/darryleffendi/travelHI/controllers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func Setup(app *fiber.App) {

	app.Post("/auth/register", controllers.Register)
	app.Post("/auth/login", controllers.Login)
	app.Get("/auth/user", controllers.User)
	app.Get("/auth/logout", controllers.Logout)

	app.Get("/game", websocket.New(controllers.WebsocketHandler))
}
