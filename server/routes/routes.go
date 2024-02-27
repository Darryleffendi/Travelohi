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

	app.Post("/admin/addpromo", controllers.AddPromo)
	app.Post("/admin/addhotel", controllers.AddHotel)
	app.Post("/admin/addroom", controllers.AddRoom)
	app.Post("/admin/addflight", controllers.AddFlight)

	app.Get("/api/get/promo", controllers.GetPromo)
	app.Get("/api/get/city", controllers.GetCities)
	app.Get("/api/get/country", controllers.GetCountries)
	app.Get("/api/get/hotel", controllers.GetHotel)
	app.Get("/api/get/plane", controllers.GetPlane)
	app.Get("/api/get/flight", controllers.GetFlight)

	app.Post("/api/get/review/from/hotel", controllers.ReviewFromHotel)
	app.Post("/api/get/room/from/hotel", controllers.RoomFromHotel)
	app.Post("/api/get/city/from/countryname", controllers.GetCitiesFromCountry)
	app.Post("/api/get/hotel/from/id", controllers.Hotel)
	app.Post("/api/get/flight/from/id", controllers.Flight)

	app.Post("api/search/hotel", controllers.SearchHotel)

	app.Post("api/add/review", controllers.AddReview)
}
