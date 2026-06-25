import eruda from "eruda"

eruda.init()

import { Game, AUTO, Scale } from "phaser"
import BootScene from './scenes/BootScene'
import GameScene from './scenes/GameScene'
import { Fullscreen } from "@boengli/capacitor-fullscreen"

;(async () => {

  await Fullscreen.activateImmersiveMode()

  try {
    const app = new Game({
      type: AUTO,
      parent: 'game-container',
      scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
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
        pixelArt: false,
        antialias: true,
        antialiasGL: true
      },
      scene: [
        BootScene,
        GameScene
      ]
    })
  } catch (error) {
    alert(error)
  }
})()