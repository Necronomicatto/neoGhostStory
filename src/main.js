import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import ScoreScene from './scenes/ScoreScene.js';

const config = {
    type: Phaser.AUTO,
    width: 768,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [TitleScene, GameScene, GameOverScene, ScoreScene]
};

const game = new Phaser.Game(config);