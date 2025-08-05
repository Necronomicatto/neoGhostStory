export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 1) {
        const idleTexture = `enemyIdle${type}`;
        super(scene, x, y, idleTexture, 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2);

        this.body.setSize(40, 60);
        this.body.setOffset(44, 68);

        this.setDepth(1);
        this.speed = 2;
        this.dead = false;
        this.type = type;

        this.play(`enemyIdle${type}`);
    }

    update(gameSpeed) {
        this.x -= this.speed * 0.5 * gameSpeed;

        if (this.dead && this.x < -this.width) {
            this.destroy();
        }
    }

    die() {
        this.dead = true;
        this.setTexture(`enemyDead${this.type}`);
        this.play(`enemyDead${this.type}`);
    }
}


