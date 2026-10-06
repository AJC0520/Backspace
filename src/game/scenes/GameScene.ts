import Phaser from "phaser";
import { WORDS } from "../constants/words";
import { Player } from "../entities/Player";

export class GameScene extends Phaser.Scene {
  private typed = "";
  private player!: Phaser.GameObjects.Rectangle;
  private display!: Phaser.GameObjects.Text;
  private enemies: Phaser.GameObjects.Rectangle[] = [];
  private enemySpeed = 10;
  private shown: Phaser.GameObjects.Text[] = [];

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    this.spawnWord();

    this.display = this.add.text(100, 100, "", {
      fontFamily: "monospace",
      fontSize: "32px",
      color: "#ffffff",
    });

    this.input.keyboard!.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        this.typed = this.typed.slice(0, -1);
      } else if (event.key.length === 1) {
        this.typed += event.key;
      }
      this.display.setText(this.typed + "|");

      if (this.shown.some((word) => word.text === this.typed)) {
        this.pushBackClosest(50);
        this.typed = "";
        this.display.setText(this.typed);
        this.spawnWord();
      }
    });

    this.player = this.add.rectangle(400, 300, 40, 40, 0x4488ff);

    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => this.spawnEnemy(),
    });
  }

  update(_time: number, delta: number) {
    for (const enemy of this.enemies) {
      enemy.x -= this.enemySpeed * (delta / 1000);

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          enemy.getBounds(),
        )
      ) {
        console.log("collision");
      }
    }
  }

  private spawnWord() {
    const word = Phaser.Utils.Array.GetRandom([...WORDS]);

    const text = this.add.text(100, 200, word, {
      fontFamily: "monospace",
      fontSize: "32px",
      color: "#ffffff",
    });

    this.shown.pop()?.destroy();
    this.shown.push(text);
  }

  private spawnEnemy() {
    const y = Phaser.Math.Between(100, 500);
    const enemy = this.add.rectangle(900, y, 40, 40, 0xff3333);
    this.enemies.push(enemy);
  }

  private pushBackClosest(amount: number) {
    let closest: Phaser.GameObjects.Rectangle | undefined;
    let best = Infinity;

    for (const enemy of this.enemies) {
      const d = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y,
      );

      if (d < best) {
        best = d;
        closest = enemy;
      }
    }
    if (closest) closest.x += amount;
  }
}
