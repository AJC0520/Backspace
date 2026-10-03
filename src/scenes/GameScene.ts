import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
    private output!: Phaser.GameObjects.Text
    private player!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('GameScene')
    }

    preload() {

    }

    create () {
        this.output = this.add.text(100, 100, 'Hello', {
            fontFamily: 'monospace',
            fontSize: '32px',
            color: '#ffffff',
        })

        this.output.setText('Hello from Phaser')
        this.player = this.add.rectangle(400, 300, 40, 40, 0xff0000);
    }

    update(_time: number, _delta: number) {
        const speed = 200 * (_delta/1000);
        if (this.cursors.left.isDown) this.player.x -= speed;
    }
}