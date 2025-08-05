import Player from '../characters/player.js';
import Enemy from '../characters/enemy.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('sky', 'assets/textures/sky_scene1.png');
        this.load.image('graves', 'assets/textures/graves_scene1.png');
        this.load.image('backTrees', 'assets/textures/back_trees_scene1.png');
        this.load.image('wall', 'assets/textures/wall_scene1.png');
        this.load.image('ground', 'assets/textures/ground_scene1.png');
        this.load.audio('bgMusic', 'assets/audio/soundtrack.wav');


        this.load.spritesheet('enemyIdle', 'assets/textures/enemyIdle.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('enemyIdle2', 'assets/textures/Idle2.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('enemyIdle3', 'assets/textures/Idle3.png', { frameWidth: 128, frameHeight: 128 });


        this.load.spritesheet('enemyDead', 'assets/textures/enemyDead.png', {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet('enemyDead2', 'assets/textures/Dead2.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('enemyDead3', 'assets/textures/Dead3.png', { frameWidth: 128, frameHeight: 128 });

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
        this.spawnDelay = Math.max(200, 3000 - this.gameSpeed * 300);

        this.bgMusic = this.sound.add('bgMusic', {
        volume: 0.5,
        loop: true
        });

        this.bgMusic.play();


        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            callback: () => this.spawnEnemy()
        });

        this.gameSpeed = 1;
        this.lastSpawnTime = 0;
        this.score = 0;
        this.scrollMid = 0;
        this.scrollFore = 0;
        this.physics.world.setBounds(0, 260, 768, 380); // only allows movement in top 500px

        this.sky = this.add.tileSprite(0, 0, 768, 640, 'sky').setOrigin(0);
        this.graves = this.add.tileSprite(0, 0, 768, 640, 'graves').setOrigin(0);
        this.backTrees = this.add.tileSprite(0, 0, 768, 640, 'backTrees').setOrigin(0);
        this.wall = this.add.tileSprite(0, 0, 768, 640, 'wall').setOrigin(0);
        this.ground = this.add.tileSprite(0, 0, 768, 640, 'ground').setOrigin(0);

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

        // Enemy 1
        this.anims.create({
            key: 'enemyIdle1',
            frames: this.anims.generateFrameNumbers('enemyIdle', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'enemyDead1',
            frames: this.anims.generateFrameNumbers('enemyDead', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });

        // Enemy 2
        this.anims.create({
            key: 'enemyIdle2',
            frames: this.anims.generateFrameNumbers('enemyIdle2', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'enemyDead2',
            frames: this.anims.generateFrameNumbers('enemyDead2', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });

        // Enemy 3
        this.anims.create({
            key: 'enemyIdle3',
            frames: this.anims.generateFrameNumbers('enemyIdle3', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'enemyDead3',
            frames: this.anims.generateFrameNumbers('enemyDead3', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });


        this.spawnEnemy();


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

        this.timerDuration = 60; // 60 seconds
        this.timeRemaining = this.timerDuration;
        this.distanceText = this.add.text(60 + 282 + 10, 78, `Distance: 0`, {
            font: '18px Arial',
            fill: '#ffffff'
        });

    }

    update() {
        const now = this.time.now;
        const delay = Math.max(300, 3000 - this.gameSpeed * 150); // Adjust to your needs

        if (now - this.lastSpawnTime > delay) {
            this.spawnEnemy(); // or spawn multiple if using that version
            this.lastSpawnTime = now;
        }

        this.player.updateInput(this.cursors, this.keyW, this.keyA, this.keyS, this.keyD, this.keySpace);

        this.scrollMid -= 0.5 * this.gameSpeed;
        this.scrollFore -= 1.0 * this.gameSpeed;
        this.sky.tilePositionX += 0.6 * this.gameSpeed;
        this.graves.tilePositionX += 0.7 * this.gameSpeed;
        this.backTrees.tilePositionX += 0.8 * this.gameSpeed;
        this.wall.tilePositionX += 0.9 * this.gameSpeed;
        this.ground.tilePositionX += 1.0 * this.gameSpeed;

        const newDelay = Math.max(300, 3000 - this.gameSpeed * 150);

        if (newDelay !== this.spawnTimer.delay) {
        this.spawnTimer.remove(); // destroy the old timer
        this.spawnTimer = this.time.addEvent({
            delay: newDelay,
            loop: true,
            callback: () => this.spawnEnemy()
        });
        }

        this.enemies.children.iterate((enemy) => {
            if (!enemy) return;

            enemy.update(this.gameSpeed);

            this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHitEnemy, null, this);
        });

        this.player.takeDamage(0.25 * this.gameSpeed/2.5);
        if (this.player.health <= 0) {
            localStorage.setItem('lastScore', this.score);
            this.scene.start('GameOverScene');
            this.bgMusic.stop();
        }

        this.score += this.gameSpeed * 0.1;
        this.distanceText.setText(`Distance: ${Math.floor(this.score)}`);
        this.drawHealth();
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(800, 900);   
        const y = Phaser.Math.Between(400, 540);

        const type = Phaser.Math.Between(1, 3); // 1, 2, or 3

        const enemy = new Enemy(this, x, y, type);
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

    handlePlayerHitEnemy(player, enemy) {
    if (!enemy.dead && player.isAttacking) {
        enemy.die();
        player.heal(60);
        this.gameSpeed += 0.5;
        this.flashRed();
    }
}

}
