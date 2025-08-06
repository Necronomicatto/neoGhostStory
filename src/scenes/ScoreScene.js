export default class ScoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScoreScene' });
    }

    preload() {
        this.load.image('gameOver', 'assets/textures/GameOver.png');
        this.load.font('scoreFont', 'assets/fonts/GothicPixels.ttf');

        this.load.audio('GOMusic', 'assets/audio/gameOver.mp3');
        this.load.audio('selection', 'assets/audio/enter.mp3');
    }

    create() {
        this.add.image(0, 0, 'gameOver').setOrigin(0);
        this.name = '';
        this.letterCount = 0;
        this.maxChars = 15;

        this.GOMusic = this.sound.add('GOMusic', {
            volume: 0.5,
            loop: true
        });
        this.selectionSound = this.sound.add('selection', {
            volume: 0.5,
            loop: false
        });

        this.GOMusic.play();

        const score = parseInt(localStorage.getItem('lastScore')) || 0;
        this.highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
        this.highScores.push(score);
        this.highScores.sort((a, b) => b - a);
        this.highScores = this.highScores.slice(0, 7);
        localStorage.setItem('highScores', JSON.stringify(this.highScores));

        this.scoreText = this.add.text(320, 200, `Score - ${score}`, { fontFamily: 'scoreFont', fontSize: '28px', color: '#ff0000' });

        this.highScores.forEach((hs, i) => {
            this.add.text(320, 250 + i * 40, `Spooky - ${hs}`, { fontFamily: 'scoreFont', fontSize: '24px', color: '#ffff00' });
        });

        this.flickerText = this.add.text(400, 550, 'Insert Coin to Play Again', {
            font: '35px textFont',
            fill: '#ff0000'
        });
        this.flickerText.setOrigin(0.5);
        this.time.addEvent({
            delay: 750,
            loop: true,
            callback: () => {
                this.flickerText.visible = !this.flickerText.visible;
            }
        });

        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('TitleScene') && this.selectionSound.play());
    }
}