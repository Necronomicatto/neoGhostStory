import Player from '../characters/player.js';
import Enemy from '../characters/enemy.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('midground', 'assets/textures/foreground.png');
        this.load.image('foreground', 'assets/textures/Battleground4.png');
        this.load.spritesheet('enemyIdle', 'assets/textures/enemyIdle.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('enemyDead', 'assets/textures/enemyDead.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.image('healthBarEmpty', 'assets/textures/HealthBarEmpty.png');
        this.load.image('healthBarFrame', 'assets/textures/HealthBarFrame.png');
        this.load.spritesheet('playerIdle', 'assets/textures/Idle.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('playerAttack', 'assets/textures/Attack_1.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.image('gameOver', 'assets/textures/GameOver.png');
    }

    create() {
        this.spawnDelay = 3000;
        this.gameSpeed = 1;
        this.score = 0;
        this.scrollMid = 0;
        this.scrollFore = 0;
        this.physics.world.setBounds(0, 260, 768, 380); // only allows movement in top 500px

        this.midground = this.add.tileSprite(0, 0, 768, 640, 'midground').setOrigin(0);
        this.foreground = this.add.tileSprite(0, 0, 768, 640, 'foreground').setOrigin(0);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 4 }),
            frameRate: 6,     
            repeat: -1        
        });
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('playerAttack', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0  // don't loop attack
        });


        this.player = new Player(this, 134, 442);
        this.enemies = this.physics.add.group();

        this.spawnEnemy();
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            callback: this.spawnEnemy,
            callbackScope: this
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.healthBar = this.add.graphics();
        this.healthBarFrame = this.add.image(20, 30, 'healthBarFrame').setOrigin(0);

        this.flashOverlay = this.add.rectangle(0, 0, 768, 640, 0xFF0000)
            .setOrigin(0)
            .setAlpha(0)
            .setDepth(1000);
    }

    update() {
        this.player.updateInput(this.cursors, this.keyW, this.keyA, this.keyS, this.keyD, this.keySpace);

        this.scrollMid -= 0.5 * this.gameSpeed;
        this.scrollFore -= 1.0 * this.gameSpeed;
        this.midground.tilePositionX += 0.5 * this.gameSpeed;
        this.foreground.tilePositionX += 1.0 * this.gameSpeed;

        this.enemies.children.iterate((enemy) => {
            if (!enemy) return;

            enemy.update(this.gameSpeed);

            if (!enemy.dead && this.player.attack && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemy.getBounds())) {
                enemy.die();
                this.player.heal(60);
                this.gameSpeed += 0.2;
                this.spawnDelay = Math.max(1000, 3000 - this.gameSpeed * 100);
                this.spawnTimer.delay = this.spawnDelay;
                this.flashRed();
            }
        });

        this.player.takeDamage(0.25 * this.gameSpeed);
        if (this.player.health <= 0) {
            localStorage.setItem('lastScore', this.score);
            this.scene.start('GameOverScene');
        }

        this.score++;
        this.drawHealth();
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(1000, 1800);
        const y = Phaser.Math.Between(500, 640);
        const enemy = new Enemy(this, x, y);
        this.enemies.add(enemy);
    }

    drawHealth() {
        this.healthBar.clear();

        const healthRatio = this.player.health / this.player.maxHealth;
        const barWidth = 282 * healthRatio;
        this.healthBar.fillStyle(0xFF0000);
        this.healthBar.fillRect(60, 78, Math.max(0, barWidth), 29);
    }

    flashRed() {
        this.flashOverlay.setAlpha(0.5);
        this.tweens.add({
            targets: this.flashOverlay,
            alpha: 0,
            duration: 150,
            ease: 'Linear'
        });
    }
}
