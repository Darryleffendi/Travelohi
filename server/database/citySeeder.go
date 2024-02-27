package database

import (
	"log"

	"github.com/darryleffendi/travelHI/models"
	"gorm.io/gorm"
)

func seedCities(db *gorm.DB) {
	countries := []models.Country{
		{Name: "United States"},
		{Name: "Canada"},
		{Name: "Australia"},
		{Name: "Indonesia"},
		{Name: "Iceland"},
		{Name: "Norway"},
		{Name: "Greenland"},
		{Name: "Switzerland"},
		{Name: "Finland"},
	}

	for _, country := range countries {
		err := db.Where(models.Country{Name: country.Name}).FirstOrCreate(&country).Error
		if err != nil {
			log.Printf("Could not seed countries: %v", err)
		}
	}

	var seededCountries []models.Country
	db.Find(&seededCountries)

	countryIDMap := make(map[string]uint)
	for _, country := range seededCountries {
		countryIDMap[country.Name] = country.ID
	}

	cities := []models.City{
		{Name: "New York", CountryId: countryIDMap["United States"], AirportCode: "JFK", AirportName: "John F. Kennedy", ImageUrl: "./cities/newyork.webp"},
		{Name: "Los Angeles", CountryId: countryIDMap["United States"], AirportCode: "LAX", AirportName: "Los Angeles Airport", ImageUrl: "./cities/losangeles.webp"},
		{Name: "Chicago", CountryId: countryIDMap["United States"], ImageUrl: "./cities/chicago.webp"},
		{Name: "Toronto", CountryId: countryIDMap["Canada"], AirportCode: "YYZ", AirportName: "Toronto Pearson", ImageUrl: "./cities/toronto.jpg"},
		{Name: "Vancouver", CountryId: countryIDMap["Canada"], AirportCode: "YVR", AirportName: "Vancouver Airport", ImageUrl: "./cities/vancouver.jpg"},
		{Name: "Montreal", CountryId: countryIDMap["Canada"], ImageUrl: "./cities/montreal.jpg"},
		{Name: "Sydney", CountryId: countryIDMap["Australia"], AirportCode: "SYD", AirportName: "Sydney Kingsford Smith", ImageUrl: "./cities/sydney.webp"},
		{Name: "Melbourne", CountryId: countryIDMap["Australia"], AirportCode: "MEL", AirportName: "Melbourne Airport", ImageUrl: "./cities/melbourne.jpg"},
		{Name: "Brisbane", CountryId: countryIDMap["Australia"], ImageUrl: "./cities/brisbane.webp"},
		{Name: "Jakarta", CountryId: countryIDMap["Indonesia"], AirportCode: "CGK", AirportName: "Soekarno-Hatta", ImageUrl: "./cities/jakarta.webp"},
		{Name: "Bali", CountryId: countryIDMap["Indonesia"], AirportCode: "DPS", AirportName: "Ngurah Rai", ImageUrl: "./cities/bali.webp"},
		{Name: "Bandung", CountryId: countryIDMap["Indonesia"], ImageUrl: "./cities/bandung.jpg"},
		{Name: "Reykjavik", CountryId: countryIDMap["Iceland"], AirportCode: "KEF", AirportName: "Keflavik Airport", ImageUrl: "./cities/reykjavik.jpg"},
		{Name: "Akureyri", CountryId: countryIDMap["Iceland"], ImageUrl: "./cities/akureyri.jpg"},
		{Name: "Oslo", CountryId: countryIDMap["Norway"], AirportCode: "OSL", AirportName: "Oslo Gardermoen", ImageUrl: "./cities/oslo.webp"},
		{Name: "Bergen", CountryId: countryIDMap["Norway"], AirportCode: "BGO", AirportName: "Bergen Flesland", ImageUrl: "./cities/bergen.jpg"},
		{Name: "Tromsø", CountryId: countryIDMap["Norway"], ImageUrl: "./cities/tromso.jpeg"},
		{Name: "Zurich", CountryId: countryIDMap["Switzerland"], AirportCode: "ZRH", AirportName: "Zurich Airport", ImageUrl: "./cities/zurich.jpg"},
		{Name: "Geneva", CountryId: countryIDMap["Switzerland"], AirportCode: "GVA", AirportName: "Geneva Airport", ImageUrl: "./cities/geneva.jpg"},
		{Name: "Bern", CountryId: countryIDMap["Switzerland"], AirportCode: "BRN", AirportName: "Bern Airport", ImageUrl: "./cities/bern.jpg"},
		{Name: "Nuuk", CountryId: countryIDMap["Greenland"], AirportCode: "GOH", AirportName: "Nuuk Airport", ImageUrl: "./cities/nuuk.jpg"},
		{Name: "Ilulissat", CountryId: countryIDMap["Greenland"], ImageUrl: "./cities/ilulissat.jpg"},
		{Name: "Qaqortoq", CountryId: countryIDMap["Greenland"], ImageUrl: "./cities/qaqortoq.jpg"},
		{Name: "Helsinki", CountryId: countryIDMap["Finland"], AirportCode: "HEL", AirportName: "Helsinki-Vantaa", ImageUrl: "./cities/helsinki.webp"},
		{Name: "Tampere", CountryId: countryIDMap["Finland"], AirportCode: "TMP", AirportName: "Tampere-Pirkkala", ImageUrl: "./cities/tampere.webp"},
		{Name: "Turku", CountryId: countryIDMap["Finland"], AirportCode: "TKU", AirportName: "Turku Airport", ImageUrl: "./cities/turku.webp"},
	}

	for _, city := range cities {
		err := db.Where(models.City{Name: city.Name}).FirstOrCreate(&city).Error
		if err != nil {
			log.Printf("Could not seed cities: %v", err)
		}
	}
}
