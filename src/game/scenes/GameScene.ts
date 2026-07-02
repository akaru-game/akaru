import { Scene } from "phaser";
import Board from "../word_match/Board";
import WordBank from "../../ui/components/WordBank"

/**
 * @class GameScene
 * @extends Phaser.Scene
 * @description Mengontrol alur utama permainan dan menangani event temuan kata dari Board.
 */
export default class GameScene extends Scene {
  constructor() {
    super('game');
  }

  create() {

    this.sentences = `
      kopi kode kuku kaku kaki 
      kupu kain buku baki baku
      kita kutu
    `

    this.wordbank = new WordBank(this, this.sentences)
    
    // 1. Inisialisasi komponen Board baru dengan mengirimkan konteks scene ini (this)
    this.board = new Board(this);

    this.board.fillWords(this.sentences);

    // 3. Menangkap event khusus saat kata target berhasil disusun di dalam board
    this.board.onWordFound((teks) => {
      
      console.log(`Callback Sukses! Kata "${teks}" terdeteksi dan dibersihkan dari memori papan.`);

      this.wordbank.wordCheck(teks)
      // Kamu bisa menambahkan logika game tambahan di sini (misal: tambah skor, sfx, dsb)
    });
  }
}
