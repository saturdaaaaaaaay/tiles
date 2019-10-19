// gamecontroller.js

/*
 * 
 */

// Alias Declarations
let AnimatedSprite = PIXI.AnimatedSprite;
let Container = PIXI.Container;
let Loader = PIXI.Loader;
let Sprite = PIXI.Sprite;
let sound = PIXI.sound;
let Texture = PIXI.Texture;
let Text = PIXI.Text;
let TextStyle = PIXI.TextStyle;

// Constants
const BOUND_LEFT = 150;
const BOUND_RIGHT = 500;
const GHOST_X = 350;
const GHOST_Y = 350;
const TWEEN_SPEED = 1000;

class GameController {
    
    /*
     * Initialize a game that takes place on STAGE with dimensions WIDTH X
     *  HEIGHT
     * 
     * STAGE: PIXI Container where the game will take place
     * WIDTH: Width of the app in pixels
     * HEIGHT: Height of the app in pixels
     */
    constructor(STAGE, WIDTH, HEIGHT) {
        this.stage = STAGE;
        this.width = WIDTH;
        this.height = HEIGHT;
        
        this.gameActive = true;
        
        this.endGameButton = new Sprite();
        this.ghost = new Sprite();
        
        this.assetLoader = new Loader();
    }

    checkGameEnd(THIS) {
        return function () {
            if (THIS.ghost.position.x >= BOUND_RIGHT) {
                THIS.gameActive = false;
            }
        }
    }

    isActive() {
        return this.gameActive;
    }

    loadAssets() {
        this.assetLoader.add("backdrop.png");
        this.assetLoader.add("ui_bg.png");
        this.assetLoader.add("ghost.png");
        this.assetLoader.add("endgame.png");
    }

    mouseupEventHandler(THIS) {
        return function (event) {
            let move_x = event.offsetX;
            if (move_x < BOUND_LEFT) {
                move_x = BOUND_LEFT;
            }
            if (move_x > BOUND_RIGHT) {
                move_x = BOUND_RIGHT;
            }
            THIS.moveGhost(move_x);
        }
    }
    
    moveGhost(NEW_X) {
        var functionCheckGameEnd = this.checkGameEnd(this);
        createjs.Tween.get(this.ghost.position).to({ x: NEW_X }, TWEEN_SPEED).call(functionCheckGameEnd);
    }

    resetGame() {
        this.ghost.position = ({ x: GHOST_X, y: GHOST_Y });
    }

    runGame() {
        this.setup();
    }
    
    setup() {
        this.loadAssets();
        this.setupBackdrop();
        this.setupEndGame();
        this.setupGhost();

        var functionOnClick = this.mouseupEventHandler(this);
        document.addEventListener("mouseup", functionOnClick);
    }
    
    setupBackdrop() {
        let backdrop = new Sprite(Texture.from("backdrop.png"));
        this.stage.addChild(backdrop);
    }

    // For testing purposes only
    setupEndGame() {
        this.endGameButton.texture = Texture.from("endgame.png");
        this.endGameButton.position = ({ x: BOUND_RIGHT, y: GHOST_Y });
        this.endGameButton.anchor = ({ x: this.endGameButton.width / 2, y: this.endGameButton.height / 2 });
        this.stage.addChild(this.endGameButton);
    }
    
    setupGhost() {
        this.ghost.texture = Texture.from("ghost.png");
        this.ghost.position = ({x: GHOST_X, y: GHOST_Y});
        this.ghost.anchor = ({x: this.ghost.width / 2, y: this.ghost.height / 2})
        this.stage.addChild(this.ghost);
    }
}
