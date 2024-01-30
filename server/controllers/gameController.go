package controllers

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/darryleffendi/travelHI/singleton"
	"github.com/darryleffendi/travelHI/util"
	"github.com/gofiber/websocket/v2"
)

func WebsocketHandler(c *websocket.Conn) {

	gameData := singleton.GetGameData()

	EstablishConnection := func() {
		if gameData.PlayerCount >= 2 {
			return
		}

		playerId := util.RandomString(7)

		player := singleton.PlayerData{
			PlayerId:    playerId,
			Conn:        c,
			PlayerIndex: gameData.PlayerCount,
			NotifyFunction: func(message map[string]interface{}) {

				message["response"] = "Game Event"
				jsonData, _ := json.Marshal(message)

				if c == nil {
					return
				}

				if err := c.WriteMessage(websocket.TextMessage, []byte(jsonData)); err != nil {
					fmt.Println("Error sending message: ", err)
					c.Close()
				}
			},
		}

		data := map[string]interface{}{
			"response":    "Connection Started",
			"playerId":    playerId,
			"playerIndex": strconv.Itoa(player.PlayerIndex),
		}

		jsonData, _ := json.Marshal(data)

		singleton.AddPlayer(&player)
		if err := c.WriteMessage(websocket.TextMessage, []byte(jsonData)); err != nil {
			fmt.Println("Error sending message: ", err)
			c.Close()
		}
		return
	}

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			c.Close()
			break
		}

		var data map[string]interface{}

		if err := json.Unmarshal(msg, &data); err != nil {
			fmt.Println("Error unmarshalling JSON:", err)
			continue
		}

		if data["request"] == "Establish Connection" {
			EstablishConnection()
		}

		if data["request"] == "Game Event" {
			singleton.NotifyEnemy(data)
		}

		/* ==== Echo for testing ==== */
		// data["playerCount"] = gameData.PlayerCount
		// response, _ := json.Marshal(data)

		// if err := c.WriteMessage(messageType, response); err != nil {
		// 	c.Close()
		// 	break
		// }
	}
}
