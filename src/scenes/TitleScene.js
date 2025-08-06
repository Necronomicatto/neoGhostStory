export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.image('menu', 'assets/textures/Menu.png');
        this.load.image('logo', 'assets/textures/logo.png');
        this.load.font('textFont', 'assets/fonts/GothicPixels.ttf');
        
        this.load.audio('titleMusic', 'assets/audio/startMenu.mp3');
        this.load.audio('selection', 'assets/audio/enter.mp3');

    }

    create() {
        this.add.image(0, 0, 'menu').setOrigin(0);

        const bg = this.sound.get('GOMusic');
        if (bg && bg.isPlaying) {
            bg.stop();
        }

        this.titleMusic = this.sound.add('titleMusic', {
            volume: 0.5,
            loop: true
        });
        this.selectionSound = this.sound.add('selection', {
            volume: 0.5,
            loop: false
        });

        this.titleMusic.play();

        this.floatingImage = this.add.image(400, 200, 'logo');
        this.floatingImage.setScale(0.45);
        this.tweens.add({
            targets: this.floatingImage,
            y: '+=5',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.flickerText = this.add.text(400, 500, 'Player 1 - Insert Coin', {
            font: '40px textFont',
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

        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('StageSelect') && this.selectionSound.play());

    }
}
