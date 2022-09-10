import * as PIXI from "pixi.js";
import Player from "./player";
import Foreign from "./foreign";
import Spawner from "./spawner";

let canvasSize = window.innerHeight/2;
const canvas = document.getElementById("app");

const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x000000,
  resolution: 2
});

initGame();

async function initGame() {
  try {
    console.log("loading...");
    await loadAssets();
    console.log("loaded");
    let player = new Player({ app });
    let zSpawner = new Spawner({
      app,
      create: () => new Foreign({ app, player })
    });
    let gameStartScene = createScene('Click to Start')
    let gameOverScene = createScene("Game Over")
    app.gameStarted = false;
  
    app.ticker.add((delta) => {
      gameOverScene.visible = player.dead
      gameStartScene.visible = !app.gameStarted
      if(app.gameStarted === false) return
      player.update(delta)
      zSpawner.spawns.forEach(d => d.update())
      bulletHitTest({
        bullets: player.shooting.bullets,
        aliens: zSpawner.spawns,
        bulletRadius: 8,
        alienRadius: 16
      })
    })
    
  } catch (error) {
    console.log(error.message);
    console.log("Load failed");
  }
}

async function loadAssets() {
  return new Promise((resolve, reject) => {
    PIXI.Loader.shared.add("bullet", "assets/bullet.png");
    PIXI.Loader.shared.add("eggHead", "assets/eggHead.png");
    PIXI.Loader.shared.add("helmlok", "assets/helmlok.png");
    PIXI.Loader.shared.add("skully", "assets/skully.png");
    PIXI.Loader.shared.add("panda", "assets/panda.png");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

function bulletHitTest({bullets, aliens, bulletRadius, alienRadius}){
  bullets.forEach(bullet => {
    aliens.forEach((alien,index) => {
      let dx = alien.position.x  - bullet.position.x
      let dy = alien.position.y  - bullet.position.y
      let distance = Math.sqrt(dx*dx, +dy*dy)
      if(distance < bulletRadius + alienRadius) {
        aliens.splice(index, 1) // remove alien
        alien.kill()
      }
    })
  })
}

function createScene(sceneText){
  const sceneContainer = new PIXI.Container()
  const text = new PIXI.Text(sceneText)
  text.x = app.screen.width / 2
  text.y = 0
  text.style.fill = 0xffffff
  text.anchor.set(0.5,0)
  sceneContainer.zIndex = 1
  sceneContainer.addChild(text)
  app.stage.addChild(sceneContainer)
  return sceneContainer
}

function startGame() {
  app.gameStarted = true
}

document.addEventListener("click", startGame)