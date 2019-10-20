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
const BOUND_LEFT = -250;
const BOUND_RIGHT = 2800;
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
    
    hitTest(X, Y, OBJECT) {
        if (OBJECT.position.x > this.house.position.x && OBJECT.position.x < this.house.position.x + 250) {
            if (X > this.house.position.x && X < this.house.position.x + 300) {
                if (Y > this.house.position.y && Y < this.house.position.y + 300) {
                    return true;
                }
            }
        }
        return false;
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
        
        this.distance = -250;
        this.gameActive = true;
        
        this.background = new Container();
        this.houses = new Container();
        this.foreground = new Container();
        
        this.ghost = new Sprite();
        
        this.houseArray = [];

        this.scrollingBG = new TilingSprite(Texture.from("tree_bg.png"), this.width, this.height);

        this.functionOnClick;
        //this.functionCheckGameEnd;
        
        this.assetLoader = new Loader();
    }
    
    addHouses(NUMBER) {
        let counter = 0;
        while (counter < NUMBER) {
            this.houseArray.push(new House(this.houses));
            this.houseArray[counter].addHouse(600 * (counter + 1));
            counter++;
        }
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
            let check = false;
            let i = 0;
            while (!check && i < THIS.houseArray.length) {
                check = THIS.houseArray[i].hitTest(event.offsetX, event.offsetY, THIS.ghost);
                i++;
            }
            if (check) {
                console.log("load match game");
            }
            else if (event.offsetY > 300 && event.offsetY < 400 && THIS.distance >= BOUND_LEFT && THIS.distance <= BOUND_RIGHT) {
                let move_x = event.offsetX - THIS.width / 2;
                if (THIS.distance + move_x < BOUND_LEFT) {
                    move_x = BOUND_LEFT - THIS.distance;
                }
                if (THIS.distance + move_x > BOUND_RIGHT) {
                    move_x = BOUND_RIGHT - THIS.distance;
                }
                
                THIS.moveGhost(move_x);
            }
        }
    }
    
    moveGhost(OFFSET) {
        this.distance += OFFSET;
        //this.functionCheckGameEnd = this.checkGameEnd(this);
        createjs.Tween.get(this.scrollingBG.tilePosition).to({x: this.scrollingBG.tilePosition.x - OFFSET / 2}, TWEEN_SPEED);
        let i;
        for (i = 0; i < this.houseArray.length; i++) {
            this.houseArray[i].moveHouse(OFFSET);
        }
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
        let target = document.getElementById("gameport");
        target.addEventListener("mousedown", this.functionOnClick);
    }
    
    setup() {
        this.loadAssets();
        this.setupBackdrop();
        this.setupScrollingBG();
        this.addHouses(5);
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
