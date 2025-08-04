export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('gameOver', 'assets/textures/GameOver.png');
    }

    create() {
        this.add.image(0, 0, 'gameOver').setOrigin(0);
        this.time.delayedCall(2000, () => this.scene.start('ScoreScene'));
    }
}
