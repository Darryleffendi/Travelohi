import GameCanvas from "./game-canvas";

export default function GamePage() {

    return (
        <div className="bg-col-a w-screen h-screen flex-col flex-center">
            <div className="w-screen h-72p"></div>
            <div className="w-screen h-64p"></div>
            <GameCanvas />
        </div>
    )
}