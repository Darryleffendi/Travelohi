package singleton

import (
	"strings"
	"sync"

	"github.com/gofiber/websocket/v2"
)

// Observer Singleton
type GameData struct {
	PlayerCount int
	Players     []PlayerData // Subscribers
}

// Subscriber Struct
type PlayerData struct {
	PlayerId       string
	PlayerIndex    int
	Conn           *websocket.Conn
	NotifyFunction func(message map[string]interface{})
}

var (
	instance *GameData
	once     sync.Once
)

// GetInstance
func GetGameData() *GameData {
	once.Do(func() {
		instance = &GameData{
			PlayerCount: 0,
			Players:     []PlayerData{},
		}
	})
	return instance
}

func AddPlayer(player *PlayerData) {
	gameData := GetGameData()

	if gameData.PlayerCount >= 2 {
		return
	}

	gameData.Players = append(gameData.Players, *player)
	gameData.PlayerCount++
}

func NotifyEnemy(data map[string]interface{}) {
	gameData := GetGameData()

	for i := 0; i < gameData.PlayerCount; i++ {
		if strings.Compare(gameData.Players[i].PlayerId, data["playerId"].(string)) != 0 {
			gameData.Players[i].NotifyFunction(data)
		}
	}
}
