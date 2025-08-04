export default class ScoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScoreScene' });
    }

    preload() {
        this.load.image('gameOver', 'assets/textures/GameOver.png');
        this.load.font('scoreFont', 'assets/fonts/alpha_beta.ttf');
    }

    create() {
        this.add.image(0, 0, 'gameOver').setOrigin(0);
        this.name = '';
        this.letterCount = 0;
        this.maxChars = 15;

        const score = parseInt(localStorage.getItem('lastScore')) || 0;
        this.highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
        this.highScores.push(score);
        this.highScores.sort((a, b) => b - a);
        this.highScores = this.highScores.slice(0, 7);
        localStorage.setItem('highScores', JSON.stringify(this.highScores));

        this.scoreText = this.add.text(380, 270, `SCORE - ${score}`, { fontFamily: 'Arial', fontSize: '28px', color: '#ffff00' });

        this.highScores.forEach((hs, i) => {
            this.add.text(380, 320 + i * 40, `SPOOKY - ${hs}`, { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' });
        });

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE && this.letterCount > 0) {
                this.name = this.name.slice(0, -1);
                this.letterCount--;
            } else if (event.key.length === 1 && this.letterCount < this.maxChars) {
                this.name += event.key;
                this.letterCount++;
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
                this.scene.start('TitleScene');
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DELETE) {
                localStorage.setItem('highScores', JSON.stringify([]));
                this.scene.restart();
            }
        });
    }
}