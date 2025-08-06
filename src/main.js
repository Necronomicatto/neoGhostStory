import TitleScene from './scenes/TitleScene.js';
import GameScene1 from './scenes/GameScene1.js';
import GameScene2 from './scenes/GameScene2.js';
import GameScene3 from './scenes/GameScene3.js';
import GameOverScene from './scenes/GameOverScene.js';
import ScoreScene from './scenes/ScoreScene.js';
import StageSelect from './scenes/StageSelect.js';

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
    scene: [TitleScene, StageSelect, GameScene1, GameScene2, GameScene3, GameOverScene, ScoreScene]
};

const game = new Phaser.Game(config);