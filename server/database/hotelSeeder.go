package database

import (
	"log"

	"github.com/darryleffendi/travelHI/models"
	"gorm.io/gorm"
)

func seedHotel(db *gorm.DB) {

	var seededCities []models.City
	db.Find(&seededCities)

	cityIds := make(map[string]uint)
	for _, city := range seededCities {
		cityIds[city.Name] = city.ID
	}

	hotels := []models.Hotel{
		{Name: "El Royale Hotel", Address: "Jl. Merdeka No.2, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111", ImageUrl: "public\\hotel\\El_Royale_Hotel\\front.webp", ImageUrls: `["public\\hotel\\El_Royale_Hotel\\hotel.webp","public\\hotel\\El_Royale_Hotel\\pool.webp"]`, Facilities: "swimmingpool,ac,elevator,h24,restaurant,wifi,park", CityId: cityIds["Bandung"], Description: "At éL Hotel Royale Bandung, experience a seamless blend of art deco style and modern technology in every room. Step into comfort and convenience with our well-equipped accommodations. From elegant furnishings to state-of-the-art amenities, each detail is designed to enhance your stay. Rest peacefully on our luxurious beds and wake up refreshed for your Bandung adventures."},
		{Name: "Pullman Legian", Address: "Jl. Melasti No.1, Legian, Kec. Kuta, Kabupaten Badung, Bali 80361", ImageUrl: "public\\hotel\\Pullman_Legian\\pullman.jpg", ImageUrls: `["public\\hotel\\Pullman_Legian\\lobby.jpg","public\\hotel\\Pullman_Legian\\pool.jpg","public\\hotel\\Pullman_Legian\\restaurant.jpg"]`, Facilities: "swimmingpool,elevator,ac,h24,restaurant,wifi,park", CityId: cityIds["Bali"], Description: "Indulge in the ultimate tropical getaway at Pullman Bali Legian Beach, where you'll find an oasis away from the bustling streets of Legian. Immerse yourself in tranquility and relaxation at Tjakra7 Spa, where you can rejuvenate your body and mind amidst serene surroundings. Experience the renowned warmth and hospitality of Balinese culture as you embark on your journey on the mystical Island of Gods. Pullman Bali Legian Beach offers not just a vacation, but a transformative experience that will leave you feeling refreshed, inspired, and deeply connected to the beauty of Bali."},
		{Name: "Pullman On the Park", Address: "192 Wellington Parade, Melbourne, 3002, Australia", ImageUrl: "public\\hotel\\Pullman_On_the_Park\\front.jpg", ImageUrls: `["public\\hotel\\Pullman_On_the_Park\\lobby.jpg","public\\hotel\\Pullman_On_the_Park\\lobby2.jpg","public\\hotel\\Pullman_On_the_Park\\pool.jpg"]`, Facilities: "swimmingpool,ac,elevator,h24,park,wifi,restaurant", CityId: cityIds["Melbourne"], Description: "Pullman Melbourne On the Park offers luxurious accommodation with views of Melbourne Cricket Ground and Fitzroy Gardens. Conveniently located near Jolimont Station, it provides easy access to attractions like Rod Laver Arena and Royal Botanic Gardens. Elegant rooms feature modern décor and amenities such as free WiFi and flat-screen TVs. Guests can enjoy the outdoor pool, spa, sauna, and high-speed WiFi. The Cliveden Bar & Dining serves European and Mediterranean-inspired cuisine with fresh local produce for a memorable dining experience."},
		{Name: "Treasury on Collins", Address: "394 Collins Street (entrance, off Queen St), Melbourne VIC 3000, Australia", ImageUrl: "public\\hotel\\Treasury_on_Collins\\front.webp", ImageUrls: `["public\\hotel\\Treasury_on_Collins\\lobby.webp","public\\hotel\\Treasury_on_Collins\\lounge.avif"]`, Facilities: "ac,elevator,h24,wifi,restaurant,park", CityId: cityIds["Melbourne"], Description: "Treasury on Collins (ToC Hotel) is a stunning 19th-century landmark in Melbourne CBD. It's been refurbished into an opulent Apartment Hotel with self-contained suites, loft apartments, and one/two-bedroom serviced apartments. These unique spaces boast well-appointed kitchenettes, washer/dryers, living/dining areas, flat-screen TVs with complimentary Netflix, and high-speed Wi-Fi. Centrally located on Collins Street, it's just a 5-minute walk to Bourke Street Mall, with easy access to public transport. Nearby attractions include Flinders Street Station, Southern Cross Station, DFO, Queen Victoria Market, Crown Casino, and countless shops, cafes, and restaurants."},
		{Name: "The Ritz-Carlton, Los Angeles", Address: "900 W Olympic Blvd, Los Angeles, CA 90015", ImageUrl: "public/hotel/The_Ritz_Carlton_Los_Angeles/front.jpg", ImageUrls: `["public/hotel/The_Ritz_Carlton_Los_Angeles/lobby.jpg","public/hotel/The_Ritz_Carlton_Los_Angeles/pool.jpg"]`, Facilities: "swimmingpool,ac,elevator,h24,restaurant,wifi,park", CityId: cityIds["Los Angeles"], Description: "Indulge in unparalleled luxury at The Ritz-Carlton, Los Angeles, where opulent accommodations await along with a rooftop pool, gym, and spa, ensuring a truly lavish experience for guests. Delight in our signature dining experiences, where culinary excellence meets impeccable service. Conveniently situated in downtown LA, our hotel is just moments away from iconic attractions such as the Staples Center and LA Live, allowing you to immerse yourself in the vibrant energy of the city while enjoying the utmost in comfort and sophistication."},
		{Name: "The Langham, Sydney", Address: "89-113 Kent St, Millers Point NSW 2000, Australia", ImageUrl: "public/hotel/The_Langham_Sydney/front.jpg", ImageUrls: `["public/hotel/The_Langham_Sydney/lobby.jpg","public/hotel/The_Langham_Sydney/pool.jpg"]`, Facilities: "swimmingpool,ac,elevator,h24,restaurant,wifi,park", CityId: cityIds["Sydney"], Description: "Discover the epitome of luxury at The Langham, Sydney, where you'll find lavish accommodations, exceptional dining, and impeccable service. Situated in the heart of Sydney, our hotel offers stunning views of the city skyline and Sydney Harbour, providing a picturesque backdrop for your stay. Relax in our beautifully appointed rooms and suites, indulge in exquisite culinary experiences, and experience the finest hospitality in this iconic destination."},
	}

	for _, hotel := range hotels {
		err := db.Where(models.Hotel{Name: hotel.Name}).FirstOrCreate(&hotel).Error
		if err != nil {
			log.Printf("Could not seed hotel: %v", err)
		}
	}
}

func seedHotelRoom(db *gorm.DB) {

	var seededHotels []models.Hotel
	db.Find(&seededHotels)

	hotelIds := make(map[string]uint64)
	for _, hotel := range seededHotels {
		hotelIds[hotel.Name] = uint64(hotel.ID)
	}

	rooms := []models.HotelRoom{
		{Name: "Pahrayangan Suite", Price: 65, BedType: "Twin Bed", Facilities: "h24,ac,elevator", ImageUrls: `["public\\hotel\\El_Royale_Hotel\\Pahrayangan_Suite\\twin.webp","public\\hotel\\El_Royale_Hotel\\Pahrayangan_Suite\\twin2.webp"]`, HotelId: hotelIds["El Royale Hotel"]},
		{Name: "Royal Suite", Price: 115, BedType: "King Size Bed", Facilities: "h24,elevator,wifi,ac,park", ImageUrls: `["public\\hotel\\El_Royale_Hotel\\Royal_Suite\\master.webp","public\\hotel\\El_Royale_Hotel\\Royal_Suite\\master2.webp"]`, HotelId: hotelIds["El Royale Hotel"]},
		{Name: "Deluxe Room", Price: 125, BedType: "King Sized Bed", Facilities: "elevator,park,ac,wifi,h24", ImageUrls: `["public\\hotel\\Pullman_Legian\\Deluxe_Room\\deluxe.jpg"]`, HotelId: hotelIds["Pullman Legian"]},
		{Name: "Deluxe Twin Room", Price: 120, BedType: "Twin Bed", Facilities: "elevator,h24,ac,park,wifi", ImageUrls: `["public\\hotel\\Pullman_Legian\\Deluxe_Twin_Room\\twin.jpg"]`, HotelId: hotelIds["Pullman Legian"]},
		{Name: "Premium Suite", Price: 415, BedType: "King Size Bed", Facilities: "elevator,h24,park,wifi,ac", ImageUrls: `["public\\hotel\\Pullman_Legian\\Premium_Suite\\supreme.jpg"]`, HotelId: hotelIds["Pullman Legian"]},
		{Name: "Superior", Price: 259, BedType: "King sized bed", Facilities: "h24,ac,elevator", ImageUrls: `["public\\hotel\\Pullman_On_the_Park\\Superior\\superior.jpg","public\\hotel\\Pullman_On_the_Park\\Superior\\superior2.jpg"]`, HotelId: hotelIds["Pullman On the Park"]},
		{Name: "Premium Suite", Price: 549, BedType: "King sized bed", Facilities: "elevator,h24,park,wifi,ac", ImageUrls: `["public\\hotel\\Pullman_On_the_Park\\Premium_Suite\\premium.jpg","public\\hotel\\Pullman_On_the_Park\\Premium_Suite\\premium2.jpg"]`, HotelId: hotelIds["Pullman On the Park"]},
		{Name: "Loft", Price: 699, BedType: "Queen sized bed", Facilities: "h24,park,wifi,ac,elevator", ImageUrls: `["public\\hotel\\Treasury_on_Collins\\Loft\\loft.webp","public\\hotel\\Treasury_on_Collins\\Loft\\loft2.webp"]`, HotelId: hotelIds["Treasury on Collins"]},
		{Name: "Suite", Price: 485, BedType: "Queen sized bed", Facilities: "elevator,h24,park,ac", ImageUrls: `["public\\hotel\\Treasury_on_Collins\\Suite\\suite.avif","public\\hotel\\Treasury_on_Collins\\Suite\\suite2.avif"]`, HotelId: hotelIds["Treasury on Collins"]},
		{Name: "Deluxe Room", Price: 400, BedType: "King Size Bed", Facilities: "h24,ac,elevator", ImageUrls: `["public/hotel/The_Ritz_Carlton_Los_Angeles/Deluxe_Room/bed.jpg","public/hotel/The_Ritz_Carlton_Los_Angeles/Deluxe_Room/bathroom.webp"]`, HotelId: hotelIds["The Ritz-Carlton, Los Angeles"]},
		{Name: "Executive Suite", Price: 800, BedType: "King Size Bed", Facilities: "h24,elevator,wifi,ac,park", ImageUrls: `["public/hotel/The_Ritz_Carlton_Los_Angeles/Executive_Suite/bedroom.jpg","public/hotel/The_Ritz_Carlton_Los_Angeles/Executive_Suite/living_room.jpg"]`, HotelId: hotelIds["The Ritz-Carlton, Los Angeles"]},
		{Name: "Deluxe Room", Price: 400, BedType: "King Size Bed", Facilities: "h24,ac,elevator", ImageUrls: `["public/hotel/The_Langham_Sydney/Deluxe_Room/bed.webp","public/hotel/The_Langham_Sydney/Deluxe_Room/bathroom.jpg"]`, HotelId: hotelIds["The Langham, Sydney"]},
		{Name: "Executive Suite", Price: 800, BedType: "King Size Bed", Facilities: "h24,elevator,wifi,ac,park", ImageUrls: `["public/hotel/The_Langham_Sydney/Executive_Suite/bedroom.jpg","public/hotel/The_Langham_Sydney/Executive_Suite/living_room.jpg"]`, HotelId: hotelIds["The Langham, Sydney"]},
	}

	for _, room := range rooms {
		err := db.Where(models.HotelRoom{Name: room.Name, HotelId: room.HotelId}).FirstOrCreate(&room).Error
		if err != nil {
			log.Printf("Could not seed room: %v", err)
		}
	}
}
