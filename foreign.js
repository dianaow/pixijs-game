import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Foreign {
  constructor({app, player}) {
    this.app = app;
    this.player = player;
    const radius = 16
    this.speed = 2
    this.foreign = new PIXI.Sprite(Math.random() < 0.3 ? PIXI.Loader.shared.resources["skully"].texture : (Math.random() < 0.7 ? PIXI.Loader.shared.resources["eggHead"].texture : IXI.Loader.shared.resources["helmlok"].texture))
    //this.foreign = new PIXI.Graphics();
    let f = this.randomSpawnPoint()
    this.foreign.position.set(f.x, f.y)
    this.foreign.scale.set(0.2, 0.2)
    // this.foreign.beginFill(0xff0000, 1)
    // this.foreign.drawCircle(0,0,radius)
    // this.foreign.endFill()
    app.stage.addChild(this.foreign)
  }

  attackPlayer() {
    if(this.attacking) return
    this.attacking = true
    this.interval = setInterval(() => this.player.attack(), 500)
  }

  update() {
    let e = new Victor(this.foreign.position.x, this.foreign.position.y)
    let s = new Victor(this.player.player.position.x, this.player.player.position.y)
    if(e.distance(s) < this.player.player.width / 2) {
      this.attackPlayer()
      return 
    }
    let d = s.subtract(e)
    let v = d.normalize().multiplyScalar(this.speed)
    this.foreign.position.set(this.foreign.position.x + v.x, this.foreign.position.y + v.y)
  }

  kill(){
    this.app.stage.removeChild(this.foreign)
    clearInterval(this.interval)
  }

  get position(){
    return this.foreign.position
  }

  randomSpawnPoint() {
    let edge = Math.floor(Math.random() * 4);
    let spawnPoint = new Victor(0,0);
    let canvasSize = this.app.screen.width;
    switch (edge) {
      case 0: //top
        spawnPoint.x = canvasSize * Math.random()
        break;
      case 1: //right
        spawnPoint.x = canvasSize
        spawnPoint.y = canvasSize * Math.random()
        break;
      case 2: //bottom
        spawnPoint.x = canvasSize * Math.random()
        spawnPoint.y = canvasSize 
        break;
      default:
        spawnPoint.x = 0
        spawnPoint.y = canvasSize * Math.random()
        break;
    }
    return spawnPoint
  }
}