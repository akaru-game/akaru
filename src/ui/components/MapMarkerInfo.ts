export default class MapMarkerInfo {
  constructor(){}

  render(title: string, info: string){
    return `
      <div class="p-2 bg-white rounded-lg">
        <h1 style="font-size: 10px" class="text-center text-sm font-bold">${title}</h1>
        <p style="font-size: 8px" class="text-sm w-40 text-center">${info}</p>
      </div>
    `
  }
}