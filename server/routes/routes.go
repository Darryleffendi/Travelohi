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
	app.Post("/auth/send/otp", controllers.RequestOTP)
	app.Post("/auth/validate/otp", controllers.ValidateOTP)
	app.Post("/auth/forget/password", controllers.ChangePassword)

	app.Get("/game", websocket.New(controllers.WebsocketHandler))

	app.Post("/admin/addpromo", controllers.AddPromo)
	app.Post("/admin/updatepromo", controllers.UpdatePromo)
	app.Post("/admin/addhotel", controllers.AddHotel)
	app.Post("/admin/addroom", controllers.AddRoom)
	app.Post("/admin/addflight", controllers.AddFlight)
	app.Get("/admin/getusers", controllers.GetUsers)
	app.Post("/admin/banuser", controllers.BanUser)
	app.Post("/admin/sendemail", controllers.SendMailToUsers)

	app.Get("/api/get/promo", controllers.GetPromo)
	app.Get("/api/get/city", controllers.GetCities)
	app.Get("/api/get/country", controllers.GetCountries)
	app.Get("/api/get/hotel", controllers.GetHotel)
	app.Get("/api/get/plane", controllers.GetPlane)
	app.Get("/api/get/flight", controllers.GetFlight)

	app.Post("/api/get/review/from/hotel", controllers.ReviewFromHotel)
	app.Post("/api/get/room/from/hotel", controllers.RoomFromHotel)
	app.Post("/api/get/room/availability", controllers.RoomAvailability)
	app.Post("/api/get/city/from/countryname", controllers.GetCitiesFromCountry)
	app.Post("/api/get/hotel/from/id", controllers.Hotel)
	app.Post("/api/get/flight/from/id", controllers.Flight)
	app.Post("/api/get/promo/from/code", controllers.Promo)

	app.Post("/api/search/hotel", controllers.SearchHotel)
	app.Post("/api/search/flight", controllers.SearchFlight)

	app.Post("/api/add/seat/cart", controllers.AddSeatToCart)
	app.Post("/api/get/seat/cart", controllers.GetSeatFromCart)
	app.Delete("/api/delete/seat/cart", controllers.DeleteSeatCart)
	app.Post("/api/add/room/cart", controllers.AddRoomToCart)
	app.Post("/api/get/room/cart", controllers.GetRoomFromCart)
	app.Patch("/api/update/room/cart", controllers.UpdateRoomCart)
	app.Delete("/api/delete/room/cart", controllers.DeleteRoomCart)
	app.Post("/api/checkout/cart", controllers.CheckoutCart)

	app.Post("/api/get/seat/ongoing", controllers.GetSeatFromOngoing)
	app.Post("/api/get/room/ongoing", controllers.GetRoomFromOngoing)
	app.Post("/api/get/seat/history", controllers.GetSeatFromHistory)
	app.Post("/api/get/room/history", controllers.GetRoomFromHistory)

	app.Patch("/api/update/user", controllers.UpdateUser)

	app.Post("/api/add/review", controllers.AddReview)
	app.Post("/api/add/seat", controllers.BookSeat)
}
