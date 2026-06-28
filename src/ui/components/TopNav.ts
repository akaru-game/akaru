export default class TopNav {
  constructor(){}

  render(width: number, height: number) {
    return `
      <div style="width: ${width}px" class="flex justify-center p-2 w-full z-50">
        <button class="flex items-center bg-stone-300 mr-3 rounded-lg pl-2 border border-2 border-green-500">
          <img class="w-5 h-5" src="public/assets/images/icons/meet2.png"></img>
          <p class="font-bold pl-1 pr-3">57000</p>
        </button>
        <button class="flex items-center bg-stone-300 ml-3 rounded-lg pl-2 border border-2 border-green-500">
          <img class="w-5 h-5" src="public/assets/images/icons/diamond2.png"></img>
          <p class="font-bold pl-1 pr-3">1000000</p>
        </button>
      </div>
    `
  }
}