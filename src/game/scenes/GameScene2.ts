import Phaser, { Scene } from "phaser";
import Item from "../objects/Item";

export default class GameScene extends Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.rows = 4;
    this.cols = 6;
    this.size = 50;

    this.board = [];

    this.positions = [];
    this.items = [];
  }

  create() {
    this.createGrid();
    this.fillBoard();

    this.input.on("dragstart", (pointer, item) => {
      item.startX = item.x;
      item.startY = item.y;
    });

    this.input.on("drag", (pointer, item, dragX, dragY) => {
      item.x = dragX;
      item.y = dragY;
    });

    this.input.on("dragend", (pointer, current) => {
      const target = this.findTarget(current); // target mengandung { x, y, item }
      const item = target.item;

      if (item && item.type === current.type) {
        console.log("sama");
        // Kembalikan current ke posisi semula jika tipenya sama (batal swap)
        current.destroy();
        item.destroy();
      } else if (item && item.type !== current.type) {
        console.log("tidak sama");

        // 1. Simpan koordinat asal target (item) sebelum ditukar
        const itemOldX = item.x;
        const itemOldY = item.y;

        // 2. Tukar posisi visual (X dan Y)
        current.x = target.x;
        current.y = target.y;
        item.setX(current.oldX) ;
        item.setY(current.oldY);

        // 3. Tukar data posisi grid (Row dan Col) di dalam objeknya
        const tempRow = current.row;
        const tempCol = current.col;

        current.row = item.row;
        current.col = item.col;
        item.row = tempRow;
        item.col = tempCol;

        // 4. Tukar posisi di dalam Array Board
        this.board[current.row][current.col].item = current;
        this.board[item.row][item.col].item = item;

        // 5. CRITICAL: Perbarui nilai oldX & oldY agar swap berikutnya tahu posisi barunya
        current.oldX = current.x;
        current.oldY = current.y;
        item.oldX = item.x;
        item.oldY = item.y;

        console.log(
          "Swap Berhasil!",
          current.row,
          current.col,
          item.row,
          item.col,
        );
      } else {
        // Jika dilepas di luar area yang valid, kembalikan ke posisi awal
        current.x = current.oldX;
        current.y = current.oldY;
      }
    });
  }

  findTarget(current) {
    let closest = this.board[0][0];
    let minDist = this.distanceTo(current, closest);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const nt = this.board[r][c];
        const d = this.distanceTo(current, nt);
        if (d < minDist) {
          minDist = d;
          closest = nt;
        }
      }
    }
    return closest;
  }

  distanceTo(current, target) {
    return Phaser.Math.Distance.Between(
      current.x,
      current.y,
      target.x,
      target.y,
    );
  }

  createGrid() {
    const startX = (this.cameras.main.width - this.cols * this.size) / 2;
    const startY = 250;

    for (let r = 0; r < this.rows; r++) {
      this.board[r] = [];
      this.positions[r] = [];

      for (let c = 0; c < this.cols; c++) {
        const x = startX + c * this.size;
        const y = startY + r * this.size;

        this.positions[r][c] = { x, y };
      }
    }
  }

  addItem(row, col, lvl) {}

  fillBoard() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const pos = this.positions[r][c];

        const textures = ["diamond", "meet"];

        const key = Phaser.Utils.Array.GetRandom(textures);

        if (!this.board[r][c]) {
          this.board[r][c] = {
            x: pos.x,
            y: pos.y,
            item: new Item(this, pos.x, pos.y, r, c, key),
          };
        }
      }
    }
  }
}
