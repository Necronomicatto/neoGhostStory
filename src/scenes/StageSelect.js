export default class StageSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'StageSelect' });
    }

    preload() {
        this.load.image('bg', 'assets/textures/stageSelect.png');
        this.load.font('textFont', 'assets/fonts/GothicPixels.ttf');

        this.load.audio('selection', 'assets/audio/enter.mp3');
    }

    create() {
        this.add.image(0, 0, 'bg').setOrigin(0);

        this.selectionSound = this.sound.add('selection', {
            volume: 0.5,
            loop: false
        });


        this.add.text(400, 100, 'Select Stage', {
            font: '32px textFont',
            fill: '#ff0000'
        }).setOrigin(0.5);

        this.stageOptions = ['Cemetery', 'Forest', 'Castle'];
        this.currentOption = 0;

        this.optionTexts = this.stageOptions.map((text, index) => {
            return this.add.text(400, 200 + index * 60, text, {
                font: '28px textFont',
                fill: '#ff0000'
            }).setOrigin(0.5);
        });

        this.updateOptionStyle();

        this.input.keyboard.on('keydown-UP', () => this.changeOption(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.changeOption(1));
        this.input.keyboard.on('keydown-ENTER', () => this.selectStage());
    }

    changeOption(direction) {
        this.currentOption = Phaser.Math.Wrap(this.currentOption + direction, 0, this.stageOptions.length);
        this.updateOptionStyle();
    }

    updateOptionStyle() {
        this.optionTexts.forEach((text, i) => {
            text.setStyle({ fill: i === this.currentOption ? '#ffffff' : '#888888' });
        });
    }

    selectStage() {
        const selected = this.currentOption;

        switch (selected) {
            case 0:
                this.scene.start('GameScene1');
                this.selectionSound.play()
                break;
            case 1:
                this.scene.start('GameScene2');
                this.selectionSound.play()
                break;
            case 2:
                this.scene.start('GameScene3');
                this.selectionSound.play()
                break;
        }
    }
}
