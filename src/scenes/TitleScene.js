export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.image('menu', 'assets/textures/Menu.png');
        this.load.image('knife', 'assets/textures/pointer.png');
    }

    create() {
        this.add.image(0, 0, 'menu').setOrigin(0);
        this.options = ['START', 'HIGHSCORES', 'EXIT'];
        this.currentOption = 0;
        this.knife = this.add.image(191, 356, 'knife');

        this.input.keyboard.on('keydown-UP', () => this.changeOption(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.changeOption(1));
        this.input.keyboard.on('keydown-ENTER', () => this.selectOption());

        this.updateKnifePosition();
    }

    changeOption(dir) {
        this.currentOption = Phaser.Math.Wrap(this.currentOption + dir, 0, this.options.length);
        this.updateKnifePosition();
    }

    updateKnifePosition() {
        const positions = [356, 452, 548];
        this.knife.setY(positions[this.currentOption]);
    }

    selectOption() {
        switch (this.currentOption) {
            case 0:
                this.scene.start('GameScene');
                break;
            case 1:
                this.scene.start('ScoreScene');
                break;
            case 2:
                this.game.destroy(true);
                break;
        }
    }
}
