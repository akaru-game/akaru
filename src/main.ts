
import eruda from "eruda"
eruda.init()

import { Fullscreen } from "@boengli/capacitor-fullscreen"

;(async ()=> {
  await Fullscreen.activateImmersiveMode()
})()

import "./game/config"