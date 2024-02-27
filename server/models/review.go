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
		var avgRating float64
		err := tx.Model(&Review{}).
			Select("AVG(rating)").
			Where("hotel_id = ? AND review_type = ?", r.HotelId, r.ReviewType).
			Scan(&avgRating).Error
		if err != nil {
			return err
		}

		err = tx.Model(&Hotel{}).
			Where("id = ?", r.HotelId).
			Update(util.CamelToSnake(r.ReviewType) + "_rating", avgRating).Error
		if err != nil {
			return err
		}
	}
	return nil
}
