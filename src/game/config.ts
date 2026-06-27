import * as Phaser from "phaser"

import InitScene from './scenes/InitScene'
import BootScene from './scenes/BootScene'
import MainMenuScene from './scenes/MainMenuScene'
import Game_RunnerScene from './scenes/Game_RunnerScene'
import Game_Match3Scene from './scenes/Game_Match3Scene'
import Game_BattleScene from './scenes/Game_BattleScene'


const app = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: "#8ea485",
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
    pixelArt: true,
    antialias: false,
    antialiasGL: false
  },
  dom: {
    createContainer: true
  },
  scene: [
    InitScene,
    BootScene,
    MainMenuScene,
    Game_RunnerScene,
    Game_Match3Scene,
    Game_BattleScene
  ]
})
