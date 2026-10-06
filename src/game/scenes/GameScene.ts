import Phaser from "phaser";
import { WORD_CATEGORIES, DIFFICULTY_ORDER } from "../constants/words";
import { Player } from "../entities/Player";

// Hitbox outlines only show in dev builds (`npm run dev`), never in production.
// Set to `true` to force them on.
const DEBUG = import.meta.env.DEV;

export class GameScene extends Phaser.Scene {
  private debugGfx!: Phaser.GameObjects.Graphics;

  // Text the player has typed so far
  private typed = "";
  private player!: Phaser.GameObjects.Rectangle;
  // Collision area around the player (taller than the player sprite)
  private hitbox!: Phaser.Geom.Rectangle;
  // On-screen text showing what the player has typed
  private display!: Phaser.GameObjects.Text;
  private enemies: Phaser.GameObjects.Rectangle[] = [];
  private maxEnemies = 5;
  // Pixels per second moving toward the player
  private enemySpeed = 10;
  // The word currently on screen (only ever holds one)
  private shown: Phaser.GameObjects.Text[] = [];

  // levels
  private level = 0;
  private currentLevelWords: string[] = [];
  private guessedLevelWords = 0;
  private progress!: Phaser.GameObjects.Text;
  private levelTotal = 0;

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    // Reset state: scene instances are reused on restart, so fields keep old values
    this.typed = "";
    this.level = 0;
    this.enemies = [];
    this.shown = [];

    this.progress = this.add.text(100, 400, "", {
      fontFamily: "monospace",
      fontSize: "32px",
      color: "#ffffff",
    });

    this.loadLevel(0);
    
    this.spawnWord();

    // Drawn above everything else so hitboxes are always visible
    this.debugGfx = this.add.graphics().setDepth(1000);

    this.display = this.add.text(100, 100, "", {
      fontFamily: "monospace",
      fontSize: "32px",
      color: "#ffffff",
    });

    // Typing input: build up the typed string one key at a time
    this.input.keyboard!.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        this.typed = this.typed.slice(0, -1);
      } else if (event.key.length === 1) {
        // length === 1 filters out keys like Shift, Enter, ArrowLeft
        this.typed += event.key;
      }
      this.display.setText(this.typed + "|");

      // Correct word: push back the nearest enemy, clear input, show a new word
      if (this.shown.some((word) => word.text === this.typed)) {
        this.pushBackClosest(50);
        this.typed = "";
        this.display.setText(this.typed);
        this.guessedLevelWords++;
        this.spawnWord();
      }
    });

    // add player
    this.player = this.add.rectangle(400, 300, 40, 40, 0x4488ff);
    // The hitbox is bigger than the rendered player. getBounds() returns a
    // fresh rectangle, so inflating it doesn't change how the player looks.
    this.hitbox = this.player.getBounds();
    Phaser.Geom.Rectangle.Inflate(this.hitbox, 0, 270);

    // hitbox drawing if debug is on
    if (DEBUG) {
      this.debugGfx.lineStyle(2, 0x00ddff);
      this.debugGfx.strokeRectShape(this.hitbox);
    }

    // Spawn a new enemy every 2 seconds
    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => this.spawnEnemy(),
    });
  }

  update(_time: number, delta: number) {
    for (const enemy of this.enemies) {
      // Move left; delta is in ms, so dividing by 1000 gives frame-rate independent speed
      enemy.x -= this.enemySpeed * (delta / 1000);

      // Enemy touched the player's hitbox: game over
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.hitbox,
          enemy.getBounds(),
        )
      ) {
        this.scene.restart();
        window.alert("game over");
        // Stop: the scene is restarting, don't keep checking the old enemies
        return;
      }
    }
  }

  // Replace the word on screen with a new random one
  private spawnWord() {
    // Tier used up: move to the next one (the last tier reloads itself)
    if (this.currentLevelWords.length === 0) this.loadLevel(this.level + 1);

    const i = Phaser.Math.Between(0, this.currentLevelWords.length - 1);
    const word = this.currentLevelWords.splice(i, 1)[0];

    const text = this.add.text(100, 200, word, {
      fontFamily: "monospace",
      fontSize: "32px",
      color: "#ffffff",
    });

    this.progress.setText(`${this.guessedLevelWords}/${this.levelTotal}`);

    // Destroy the old word before storing the new one
    this.shown.pop()?.destroy();
    this.shown.push(text);
  }

  // Add an enemy at the right edge, at a random height, up to maxEnemies
  private spawnEnemy() {
    if (this.enemies.length == this.maxEnemies) return;
    const y = Phaser.Math.Between(100, 500);
    const enemy = this.add.rectangle(900, y, 40, 40, 0xff3333);
    this.enemies.push(enemy);
  }

  // Find the enemy nearest the player (straight-line distance) and push it
  // back to the right by `amount` pixels
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
    // No enemies on screen yet: nothing to push
    if (closest) closest.x += amount;
  }

  private loadLevel(level: number) {
    this.level = Math.min(level, DIFFICULTY_ORDER.length - 1);
    this.currentLevelWords = [...WORD_CATEGORIES[DIFFICULTY_ORDER[this.level]]];
    this.levelTotal = this.currentLevelWords.length;
    this.guessedLevelWords = 0;
  }
}
