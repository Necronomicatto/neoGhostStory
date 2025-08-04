export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemyIdle');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);

        this.dead = false;
        this.speed = 1;
    }

    update(gameSpeed) {
        this.x -= this.speed * gameSpeed;

        if (this.dead && this.x < -this.width) {
            this.destroy();
        }
    }

    die() {
        this.dead = true;
        this.setTexture('enemyDead');
    }
}
