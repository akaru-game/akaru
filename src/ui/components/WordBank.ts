import { Scene } from "phaser"

export default class WordBank {
  html: string;
  dom: Phaser.GameObjects.DOMElement;

  constructor(scene: Scene, words: string) {
    const { width, height } = scene.scale
    
    // Pecah string menjadi array kata
    const wordArray = words.replace(/\n/g, " ").split(" ");

    this.html = `
      <div style="width: ${width}px" class="flex flex-wrap justify-center items-center w-max max-w-full bg-blue-300 p-2 rounded">
        ${wordArray.map(w => w !== "" ? `
          <span id="word-${w.toLowerCase()}" class="mr-1 text-blue-100 transition-all duration-300">
            ${w.toUpperCase().trim()}
          </span>
        ` : null).join("")}
      </div>
    `.trim();

    this.dom = scene.add.dom(width * 0.5, height * 0.30)
      .createFromHTML(this.html)
      .setOrigin(0.5)
  }

  /**
   * Fungsi untuk mengubah style kata jika berhasil ditebak/dicek
   * @param word Kata yang ingin diupdate (misal: "apple")
   */
  wordCheck(word: string) {
    const targetId = `word-${word.toLowerCase()}`;
    
    // Mengambil elemen HTML langsung dari dalam DOM Phaser
    const wordElement = this.dom.getChildByID(targetId) as HTMLElement;

    if (wordElement) {
      // Contoh 1: Mengubah warna teks menggunakan class Tailwind (coret/ganti warna)
      wordElement.classList.remove('text-blue-100');
      wordElement.classList.add('text-green-500', 'line-through'); 

      // Contoh 2: Jika ingin mengubah teksnya langsung (opsional)
      // wordElement.innerText = "DONE";
    } else {
      console.warn(`Kata dengan id ${targetId} tidak ditemukan.`);
    }
  }

  /**
   * Fungsi opsional jika kamu ingin mereset semua kata kembali ke awal
   */
  resetBank(words: string) {
    const wordArray = words.split(" ");
    wordArray.forEach(w => {
      const wordElement = this.dom.getChildByID(`word-${w.toLowerCase()}`) as HTMLElement;
      if (wordElement) {
        wordElement.className = "mr-1 text-blue-100 transition-all duration-300"; // kembalikan class asal
      }
    });
  }
}