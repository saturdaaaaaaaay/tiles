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
const GHOST_X = 150;
const GHOST_Y = 350;
const TWEEN_SPEED = 100;

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
        return function(event) {
            if (event.offsetX > 0 && event.offsetX < 100 && event.offsetY > 0 && event.offsetY < 100) {
                this.gameActive = false;
                console.log("gameActive: " + this.gameActive);
            }
            else if (event.offsetX < THIS.ghost.position.x) {
                THIS.moveLeft();
            } else if (event.offsetX > THIS.ghost.position.x) {
                THIS.moveRight();
            }
        }
    }
    
    moveLeft() {
        console.log("move left");
    }
    
    moveRight() {
        console.log("move right");
    }

    runGame() {
        this.setup();
    }
    
    setup() {
        this.loadAssets();
        this.setupBackdrop();
        this.setupEndGameButton();
        this.setupGhost();

        var functionOnClick = this.mouseupEventHandler(this);
        document.addEventListener("mouseup", functionOnClick);
    }
    
    setupBackdrop() {
        let backdrop = new Sprite(Texture.from("backdrop.png"));
        this.stage.addChild(backdrop);
    }
    
    setupEndGameButton() {
        this.endGameButton.texture = Texture.from("endgame.png");
        this.endGameButton.position = ({x: 0, y: 0});
        this.stage.addChild(this.endGameButton);
    }
    
    setupGhost() {
        this.ghost.texture = Texture.from("ghost.png");
        this.ghost.position = ({x: GHOST_X, y: GHOST_Y});
        this.ghost.anchor = ({x: this.ghost.width / 2, y: this.ghost.height / 2})
        this.stage.addChild(this.ghost);
    }
}
