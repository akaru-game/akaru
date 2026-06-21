import { Game, AUTO } from "phaser"
import BootScene from './scenes/BootScene'

const container = document.getElementById('game-container')

try {
  const app = new Game({
    type: AUTO,
    parent: 'game-container',
    width: container.clientWidth,
    height: container.clientHeight,
    //scale: Scale.FIT,
    //autoCenter: Scale.CENTER_BOTH,
    backgroundColor: '#ccc',
    scene: [
      BootScene
    ]
  })
} catch (error) {
  alert(error)
}