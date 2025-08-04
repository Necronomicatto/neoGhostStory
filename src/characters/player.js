export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'playerIdle', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2);
        this.setCollideWorldBounds(true);
        
        this.play('idle');
        this.on('animationcomplete', (anim) => {
            if (anim.key === 'attack') {
                this.isAttacking = false;
                this.setTexture('playerIdle');
                this.play('idle');
            }
        });
        

        this.maxHealth = 282;
        this.health = this.maxHealth;
        this.attack = false;
        this.lastAttackTime = 0;
        this.isAttacking = false;
        

    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    updateInput(cursors, keyW, keyA, keyS, keyD, keySpace) {
        const speed = 200 / 60;

        if (cursors.left.isDown || keyA.isDown) this.x -= speed;
        if (cursors.right.isDown || keyD.isDown) this.x += speed;
        if (cursors.up.isDown || keyW.isDown) this.y -= speed;
        if (cursors.down.isDown || keyS.isDown) this.y += speed;

        const now = this.scene.time.now;

        if (keySpace.isDown && !this.isAttacking && (now - this.lastAttackTime > 500)) {
            this.isAttacking = true;
            this.lastAttackTime = now;
            this.setTexture('playerAttack');
            this.play('attack');
        }

    }
}
