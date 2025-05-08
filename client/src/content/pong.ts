import { App } from "../classes/App.js";
import Game, { GameUserType } from "../classes/Game/Game.js";
import { getPlayerAvatarPath, getPlayerName } from "../utils/utils.js";

function pongHTML(player1: GameUserType, player2: GameUserType) {
    console.log("Rendering Pong page")
    console.log(player1, player2)
    return /*HTML*/`
    <div class="flex flex-col w-fit">
        <div id="players" class="grid grid-cols-3 mb-4">
            <div id="player1" class="flex items-center gap-4">
                <img src="${getPlayerAvatarPath(player1)}" class="avatar w-12"/>
                <h2>${getPlayerName(player2)}</h2>
            </div>
            <img src="/assets/images/VS-image.png" class="h-12 mx-auto"/>
            <div id="player2" class="justify-self-end flex items-center gap-4">
            <h2>${getPlayerName(null)}</h2>
            <img src="${getPlayerAvatarPath(null)}" class="avatar w-12"/>
            </div>
        </div>
        <canvas id="gameCanvas"></canvas>
        <div id="gameOptions" class="flex gap-4 flex-wrap">
                <p>Game options |</p>
                <p>Ball Speed: 5</p>
                <p>Ball Radius: 10</p>
                <p>Ball Acceleration: 0.1</p>
                <p>Paddle Speed: 5</p>
                <p>Paddle Size: 100</p>
                <p>Max Score: 3</p>
        </div>
    </div>
    `
}

export async function renderPong(app: App){
    app.hideBackground()

    let player1 = app.loggedUser || "Joueur 1"
    let player2 = null

    app.changeContent(pongHTML(player1, player2))

    // Create the game instance
    const game = new Game(app.content.root.querySelector("#gameCanvas") as HTMLCanvasElement)
    // Render the initial paused game screen
    game.setRenderState(true)
}