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
let TilingSprite = PIXI.TilingSprite;

// Constants
const BOUND_LEFT = 150;
const BOUND_RIGHT = 500;
const GHOST_X = 400;
const GHOST_Y = 350;
const TWEEN_SPEED = 1000;

class House {
    constructor(STAGE) {
        this.stage = STAGE;
        
        this.assetloader = new Loader();
        this.assetloader.add("house.png");
        
        this.house = new Sprite(Texture.from("house.png"));
    }
    
    addHouse(X) {
        this.house.position = ({x: X, y: 100});
        this.stage.addChild(this.house);
    }
    
    moveHouse(OFFSET) {
        createjs.Tween.get(this.house.position).to({x: this.house.position.x - OFFSET}, TWEEN_SPEED);
    }
}

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
        
        this.background = new Container();
        this.houses = new Container();
        this.foreground = new Container();
        
        this.endGameButton = new Sprite();
        this.ghost = new Sprite();
        this.house;

        this.scrollingBG = new TilingSprite(Texture.from("tree_bg.png"), this.width, this.height);

        this.functionOnClick;
        //this.functionCheckGameEnd;
        
        this.assetLoader = new Loader();
    }
    
    addHouses() {
        this.house = new House(this.houses);
        this.house.addHouse(500);
        this.stage.addChild(this.houses);
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
    }

    mouseupEventHandler(THIS) {
        return function (event) {
            let move_x = event.offsetX - THIS.width / 2;
            THIS.moveGhost(move_x);
        }
    }
    
    moveGhost(OFFSET) {
        //this.functionCheckGameEnd = this.checkGameEnd(this);
        createjs.Tween.get(this.scrollingBG.tilePosition).to({x: this.scrollingBG.tilePosition.x - OFFSET / 2}, TWEEN_SPEED);
        this.house.moveHouse(OFFSET);
    }

    resetGame() {
        this.ghost.position = ({x: GHOST_X, y: GHOST_Y});
    }

    runGame() {
        this.setup();
        this.setMouseListener();
    }
    
    setMouseListener() {
        this.functionOnClick = this.mouseupEventHandler(this);
        document.addEventListener("mousedown", this.functionOnClick);
    }
    
    setup() {
        this.loadAssets();
        this.setupBackdrop();
        this.setupScrollingBG();
        this.addHouses();
        this.setupGhost();
    }
    
    setupBackdrop() {
        let backdrop = new Sprite(Texture.from("backdrop.png"));
        this.stage.addChild(backdrop);
    }
    
    setupGhost() {
        this.ghost.texture = Texture.from("ghost.png");
        this.ghost.position = ({x: GHOST_X, y: GHOST_Y});
        this.ghost.anchor = ({x: this.ghost.width / 2, y: this.ghost.height / 2});
        this.foreground.addChild(this.ghost);
        this.stage.addChild(this.foreground);
    }
    
    setupScrollingBG() {
        this.stage.addChild(this.background);
        this.background.addChild(this.scrollingBG);
    }
}
