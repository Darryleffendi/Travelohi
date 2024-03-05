package models

import (
	"github.com/darryleffendi/travelHI/util"
	"gorm.io/gorm"
)

type Review struct {
	gorm.Model
	Review      string `json:"review"`
	ReviewType  string `json:"reviewType"`
	Rating      uint64 `json:"rating"`
	UserId      uint64 `json:"userId"`
	HotelId     uint64 `json:"hotelId"`
	IsAnonymous bool   `json:"isAnonymous"`
	User        User   `gorm:"foreignKey:UserId" json:"user"`
}

func (r *Review) AfterCreate(tx *gorm.DB) (err error) {

	if r.ReviewType == "Cleanliness" || r.ReviewType == "Comfort" || r.ReviewType == "Location" || r.ReviewType == "Service" {

		//  Get Average Rating According to Type
		var avgRating float64
		err := tx.Model(&Review{}).
			Select("AVG(rating)").
			Where("hotel_id = ? AND review_type = ?", r.HotelId, r.ReviewType).
			Scan(&avgRating).Error
		if err != nil {
			return err
		}

		// Update Hotel Rating Type in DB
		err = tx.Model(&Hotel{}).
			Where("id = ?", r.HotelId).
			Update(util.CamelToSnake(r.ReviewType)+"_rating", avgRating).Error
		if err != nil {
			return err
		}

		// Update Overall Hotel Rating
		var hotel Hotel
		err = tx.Find(&hotel, r.HotelId).Error
		if err != nil {
			return err
		}

		ratings := []uint{hotel.CleanlinessRating, hotel.ComfortRating, hotel.LocationRating, hotel.ServiceRating}
		var sum uint
		var count uint
		var avgRating2 uint

		for _, rating := range ratings {
			if rating > 0 {
				sum += rating
				count++
			}
		}

		if count > 0 {
			avgRating2 = sum / count
		} else {
			avgRating2 = 0
		}

		err = tx.Model(&Hotel{}).
			Where("id = ?", r.HotelId).
			Update("rating", avgRating2).Error
		if err != nil {
			return err
		}
	}
	return nil
}
