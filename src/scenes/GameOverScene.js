export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('gameOver', 'assets/textures/GameOver.png');
        this.load.audio('death', 'assets/audio/death.mp3');
    }

    create() {
        this.add.image(0, 0, 'gameOver').setOrigin(0);
        this.death = this.sound.add('death', {
            volume: 0.5,
            loop: false
        });
        this.death.play();
        this.time.delayedCall(2000, () => this.scene.start('ScoreScene'));
    }
}
