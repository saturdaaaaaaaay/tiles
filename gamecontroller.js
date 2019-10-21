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

// ####################################### CLASSES ############################

class House {
    /*
     * Represents a house in-game
     * 
     * takes PIXI.Container: STAGE
     */
    constructor(STAGE) {
        this.stage = STAGE;
        
        // Signals if the house is active or not
        this.lightOn = true;
        
        this.assetloader = new Loader();
        this.assetloader.add("house.png");
        
        // "house" is actually a container holding building and light
        this.house = new Container();
        this.building = new Sprite(Texture.from("house.png"));
        this.light = new Sprite(Texture.from("light.png"));
    }
    
    // A house is a container with a building and a light.
    addHouse(X) {
        this.house.addChild(this.building);
        this.house.addChild(this.light);
        this.house.position = ({x: X, y: 100});
        this.stage.addChild(this.house);
    }
    
    // Turn the light off to signal house is inactive
    deactivateHouse() {
        this.lightOn = false;
        this.light.visible = false;
    }
    
    // Check if both the x,y (from mouse click) and object have overlap with
    // this house
    hitTest(X, Y, OBJECT) {
        if (this.lightOn) {
            if (OBJECT.position.x > this.house.position.x && OBJECT.position.x < this.house.position.x + 250) {
                if (X > this.house.position.x && X < this.house.position.x + 300) {
                    if (Y > this.house.position.y && Y < this.house.position.y + 300) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    // Moves the house as the player "moves" (scrolling bg style)
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
        
        // Keep track of distance from origin
        this.distance = BOUND_LEFT;
        
        this.gameActive = true;
        
        // Houses completed vs goal
        this.completed = 0;
        this.goal = 5;

        // Scene Graph
        /*
         * Stage <- Backdrop (non scrolling)
         * Stage <- Background <- Scrolling Background
         * Stage <- Houses <- House (multiple, scrolling)
         * Stage <- Foreground <- Ghost, UI
         */
        this.stage.addChild(new Sprite(Texture.from("backdrop.png")));
        
        this.background = new Container();
        this.stage.addChild(this.background);
        
        this.houses = new Container();
        this.stage.addChild(this.houses);
        
        this.foreground = new Container();
        this.stage.addChild(this.foreground);
        
        // Player character
        this.ghost = new Sprite();
        
        // Array of houses
        this.houseArray = [];

        this.scrollingBG = new TilingSprite(Texture.from("tree_bg.png"), this.width, this.height);

        // Class property to represent the function so that it can be removed
        this.functionOnClick;

        this.assetLoader = new Loader();

        // Setup the stage with the assets
        this.setup();
    }
    
    // Adds houses to the stage; NUMBER = number of houses to add
    addHouses(NUMBER) {
        let counter = 0;
        while (counter < NUMBER) {
            this.houseArray.push(new House(this.houses));
            this.houseArray[counter].addHouse(600 * (counter + 1));
            counter++;
        }
    }

    // Used to check if the game has ended
    checkGameEnd(THIS) {
        THIS.gameActive = !(THIS.completed === THIS.goal);
    }

    // Method to return if game is active
    isActive() {
        return this.gameActive;
    }

    // Load assets needed
    loadAssets() {
        this.assetLoader.add("backdrop.png");
        this.assetLoader.add("ui_bg.png");
        this.assetLoader.add("ghost.png");
    }

    // Handles all the mouse clicking in-game
    mouseupEventHandler(THIS) {
        return function (event) {
            let check = false;
            let i = 0;
            
            // Check to see if a house is activated
            while (!check && i < THIS.houseArray.length) {
                check = THIS.houseArray[i].hitTest(event.offsetX, event.offsetY, THIS.ghost);
                i++;
            }
            if (check) {
                console.log("load match game");
                THIS.houseArray[i - 1].deactivateHouse();
                THIS.completed++;
                THIS.checkGameEnd(THIS);
            }
            
            // No house activated, so move player
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
    
    // Handles "movement" of the player (moves background and houses)
    moveGhost(OFFSET) {
        this.distance += OFFSET;
        //this.functionCheckGameEnd = this.checkGameEnd(this);
        createjs.Tween.get(this.scrollingBG.tilePosition).to({x: this.scrollingBG.tilePosition.x - OFFSET / 2}, TWEEN_SPEED);
        let i;
        for (i = 0; i < this.houseArray.length; i++) {
            this.houseArray[i].moveHouse(OFFSET);
        }

    moveGhost(NEW_X) {
        var functionCheckGameEnd = this.checkGameEnd(this);
        createjs.Tween.get(this.ghost.position).to({ x: NEW_X }, TWEEN_SPEED).call(functionCheckGameEnd);
        let i;
        for (i = 0; i < this.houseArray.length; i++) {
            this.houseArray[i].moveHouse(OFFSET);
        }
    }

    // Resets game back to starting state
    resetGame() {
        this.ghost.position = ({x: GHOST_X, y: GHOST_Y});
        this.distance = BOUND_LEFT;
        this.completed = 0;
        this.gameActive = true;

        // Reset the houses
        this.houses.removeChildren();
        this.houseArray = [];
        this.addHouses(this.goal);
    }

    // Start a new game
    runGame() {
        this.resetGame();
        this.setMouseListener();
    }
    
    // Add a mouse listener to the game
    setMouseListener() {
        this.functionOnClick = this.mouseupEventHandler(this);
        let target = document.getElementById("gameport");
        target.addEventListener("mouseup", this.functionOnClick);
    }
    
    // Various tasks for setting up the game
    setup() {
        this.loadAssets();
        this.setupScrollingBG();
        this.setupGhost();
    }
    
    // Add the player character (a ghost)
    setupGhost() {
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
        this.ghost.anchor = ({x: this.ghost.width / 2, y: this.ghost.height / 2});
        this.foreground.addChild(this.ghost);
    }
    
    // Add a scrolling background
    setupScrollingBG() {
        this.background.addChild(this.scrollingBG);
    }
}
