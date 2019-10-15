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
const GHOST_X = 100;
const GHOST_Y = 300;
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
    }

    mouseupEventHandler(event) {
        if (event.offsetX < this.ghost.position.x) {
            console.log("move left");
        }
        else if (event.offsetX > this.ghost.position.x) {
            console.log("move right");
        }
    }

    runGame() {
        this.setup();
    }
    
    setup() {
        this.loadAssets();
        this.setupBackdrop();
        this.setupGhost();
        
        document.addEventListener("mouseup", this.mouseupEventHandler);
    }
    
    setupBackdrop() {
        let backdrop = new Sprite(Texture.from("backdrop.png"));
        this.stage.addChild(backdrop);
    }
    
    setupGhost() {
        this.ghost.texture = Texture.from("ghost.png");
        this.ghost.position = ({x: GHOST_X, y: GHOST_Y});
        this.stage.addChild(this.ghost);
    }
}
