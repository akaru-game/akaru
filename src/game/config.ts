import * as Phaser from "phaser"

import BootScene from './scenes/BootScene'
import GameScene from './scenes/GameScene'

const app = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#ccffcc',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  render: {
    resolution: window.devicePixelRatio || 1,
    pixelArt: false,
    antialias: false,
    antialiasGL: false,
    roundPixels: true
  },
  dom: {
    createContainer: true
  },
  scene: [
    BootScene,
    GameScene
  ]
})
