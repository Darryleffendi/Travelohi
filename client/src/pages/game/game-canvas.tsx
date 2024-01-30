import { useEffect, useRef, useState } from "react";
import Fighter from './models/fighter.js'
import Sprite from './models/sprite.js'
import { getSocketConnection } from "./socket-handler.js";
import styles from "../../styles/game.module.css"

export default function GameCanvas({playerId, socket} : any) {

    const canvasRef = useRef<any>(null);
    let requestId : any;

    var canvas : any = null;
    var ctx : any = null;

    var fireElemental : any;
    var crystalElemental : any;
    var background : any;
    var platform : any;

    var socket : any = null;
    var playerId : any = null;
    var playerIndex = -1;

    var keys : any = {
        'KeyA': false,
        'KeyD': false,
        'KeyW': false,
        'Space': false,
    }

    var enemyKeys : any = {
        'KeyA': false,
        'KeyD': false,
        'KeyW': false,
        'Space': false,
    }

    const keyDownListener = (event : any) => {
        keys[event.code] = true;
        
        socket.send(JSON.stringify({
            'request': 'Game Event',
            'playerId' : playerId,
            ...keys,
        }));
    }
    
    const keyUpListener = (event : any) => {
        keys[event.code] = false;

        socket.send(JSON.stringify({
            'request': 'Game Event',
            'playerId' : playerId,
            ...keys,
        }));
    }

    const messageFunction = (event : MessageEvent) => {
        const data = JSON.parse(event.data);

        if(data.response == "Connection Started") {
            playerId = data.playerId;
            playerIndex = data.playerIndex;
        }
        else if(data.response == "Game Event") {
            enemyKeys = data
        }
    }

    useEffect(() => {

        /* ==== Setting up Websocket ==== */
        
        if(socket == null) {
            socket = getSocketConnection(messageFunction)
        }
        /* ==== Setting up canvas ==== */

        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");

        fireElemental = new Fighter({
            position: {
                x: 30,
                y: 100
            },
            imageSrc: "./game-assets/fire-elemental/idle.png",
            frameCount: 8,
            scale: 2.8,
            canvas: canvas,
            ctx: ctx,
            attackMaxIndex : 2, 
            sprites: {
                idle: {
                    imageSrc: './game-assets/fire-elemental/idle.png',
                    frameCount: 8
                },
                idle_flipped: {
                    imageSrc: './game-assets/fire-elemental/idle_flipped.png',
                    frameCount: 8
                },
                run: {
                    imageSrc: './game-assets/fire-elemental/run.png',
                    frameCount: 8
                },
                run_flipped: {
                    imageSrc: './game-assets/fire-elemental/run_flipped.png',
                    frameCount: 8
                },
                jump: {
                    imageSrc: './game-assets/fire-elemental/jump.png',
                    frameCount: 3
                },
                jump_flipped: {
                    imageSrc: './game-assets/fire-elemental/jump_flipped.png',
                    frameCount: 3
                },
                fall: {
                    imageSrc: './game-assets/fire-elemental/fall.png',
                    frameCount: 3
                },
                fall_flipped: {
                    imageSrc: './game-assets/fire-elemental/fall_flipped.png',
                    frameCount: 3
                },
                attack1: {
                    imageSrc: './game-assets/fire-elemental/attack1.png',
                    frameCount: 11
                },
                attack1_flipped: {
                    imageSrc: './game-assets/fire-elemental/attack1_flipped.png',
                    frameCount: 11
                },
                attack2: {
                    imageSrc: './game-assets/fire-elemental/attack2.png',
                    frameCount: 11
                },
                attack2_flipped: {
                    imageSrc: './game-assets/fire-elemental/attack2_flipped.png',
                    frameCount: 11
                },
                specialAttack: {
                    imageSrc: './game-assets/fire-elemental/specialAttack.png',
                    frameCount: 18
                },
                specialAttack_flipped: {
                    imageSrc: './game-assets/fire-elemental/specialAttack_flipped.png',
                    frameCount: 18
                },
                airAttack: {
                    imageSrc: './game-assets/fire-elemental/airAttack.png',
                    frameCount: 8
                },
                airAttack_flipped: {
                    imageSrc: './game-assets/fire-elemental/airAttack_flipped.png',
                    frameCount: 8
                },
            },
            keys : {
                'left': false,
                'right': false,
                'up': false,
                'down' : false,
                'attack': false,
            }
        });

        crystalElemental = new Fighter({
            position: {
                x: 500,
                y: 100
            },
            imageSrc: "./game-assets/crystal-elemental/idle.png",
            frameCount: 8,
            scale: 2.8,
            canvas: canvas,
            ctx: ctx,
            attackMaxIndex : 2, 
            sprites: {
                idle: {
                    imageSrc: './game-assets/crystal-elemental/idle.png',
                    frameCount: 8
                },
                idle_flipped: {
                    imageSrc: './game-assets/crystal-elemental/idle_flipped.png',
                    frameCount: 8
                },
                run: {
                    imageSrc: './game-assets/crystal-elemental/run.png',
                    frameCount: 8
                },
                run_flipped: {
                    imageSrc: './game-assets/crystal-elemental/run_flipped.png',
                    frameCount: 8
                },
                jump: {
                    imageSrc: './game-assets/crystal-elemental/jump.png',
                    frameCount: 3
                },
                jump_flipped: {
                    imageSrc: './game-assets/crystal-elemental/jump_flipped.png',
                    frameCount: 3
                },
                fall: {
                    imageSrc: './game-assets/crystal-elemental/fall.png',
                    frameCount: 3
                },
                fall_flipped: {
                    imageSrc: './game-assets/crystal-elemental/fall_flipped.png',
                    frameCount: 3
                },
                attack1: {
                    imageSrc: './game-assets/crystal-elemental/attack1.png',
                    frameCount: 7
                },
                attack1_flipped: {
                    imageSrc: './game-assets/crystal-elemental/attack1_flipped.png',
                    frameCount: 7
                },
                attack2: {
                    imageSrc: './game-assets/crystal-elemental/attack2.png',
                    frameCount: 7
                },
                attack2_flipped: {
                    imageSrc: './game-assets/crystal-elemental/attack2_flipped.png',
                    frameCount: 7
                },
                specialAttack: {
                    imageSrc: './game-assets/crystal-elemental/specialAttack.png',
                    frameCount: 15
                },
                specialAttack_flipped: {
                    imageSrc: './game-assets/crystal-elemental/specialAttack_flipped.png',
                    frameCount: 15
                },
                airAttack: {
                    imageSrc: './game-assets/crystal-elemental/airAttack.png',
                    frameCount: 8
                },
                airAttack_flipped: {
                    imageSrc: './game-assets/crystal-elemental/airAttack_flipped.png',
                    frameCount: 8
                },
            },
            keys : {
                'left': false,
                'right': false,
                'up': false,
                'down' : false,
                'attack': false,
            }
        });

        background = new Sprite({
            position: {
                x: 0, 
                y: 0
            },
            imageSrc: "./game-assets/background.png",
            frameCount: 1,
            canvas: canvas,
            ctx: ctx,
        })

        platform = new Sprite({
            position: {
                x: 0, 
                y: 0
            },
            imageSrc: "./game-assets/platform.png",
            frameCount: 1,
            canvas: canvas,
            ctx: ctx,
        })

        requestId = requestAnimationFrame(animate);
        window.addEventListener("keydown", keyDownListener);
        window.addEventListener("keyup", keyUpListener);

        return () => {
            cancelAnimationFrame(requestId);
            window.removeEventListener("keydown", keyDownListener);
            window.removeEventListener("keyup", keyUpListener);

            if(socket != null) {
                if(socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
            }
        };
    }, []);

    const animate = (frameCount : any) => {
        canvas.width = 1280;
        canvas.height = 576;

        background.draw();

        if(fireElemental.position.x > crystalElemental.position.x) {
            fireElemental.flipped = true;
            crystalElemental.flipped = false
        }
        else {
            fireElemental.flipped = false;
            crystalElemental.flipped = true;
        }

        if(playerIndex == 0) {
            fireElemental.update(keyToTrigger(keys));
            crystalElemental.update(keyToTrigger(enemyKeys));
        }
        else {
            fireElemental.update(keyToTrigger(enemyKeys));
            crystalElemental.update(keyToTrigger(keys));
        }
        platform.draw();

        requestId = requestAnimationFrame(animate);
    }
    
    const keyToTrigger = (key : any) => {
        return {
            'left' : key.KeyA,
            'right' : key.KeyD,
            'up' : key.KeyW,
            'down' : key.KeyS,
            'attack' : key.Space
        }
    }
    return <div className={styles.game}>
        <canvas ref={canvasRef}  />
    </div>;
}

/*

    SPRITE CREDITS

    Fire Elemental
    https://chierit.itch.io/elementals-fire-knight

    Crystal Elemental
    https://chierit.itch.io/elementals-crystal-mauler

    Background
    https://ansimuz.itch.io/bulkhead-walls-environment

*/