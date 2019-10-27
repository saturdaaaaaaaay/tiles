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
const ANIM_SPEED = 0.07;
const BOUND_LEFT = 100;
const BOUND_RIGHT = 600;
const BOUND_TOP = 100;
const BOUND_BOTTOM = 300;
const GHOST_X = 350;
const GHOST_Y = 200;
const TWEEN_SPEED = 1000;

const TILE_SIZE = 300;
const GRASS = 10;
const HOUSE = 11;
const ROAD = 12;
const TREE = 13;

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
        
        // "house" is actually a container holding building and light
        this.house = new Container();
        this.building = new Sprite(Texture.from("pg_house_tile.png"));
        this.light = new Sprite(Texture.from("light.png"));
        this.house.visible = false;
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

class Tile {
    constructor(TYPE) {
        this.description = TYPE;
        this.sprite = new Sprite();
        
        this.createSprite();
    }
    
    createSprite() {
        switch(this.description) {
            case GRASS:
                this.sprite.texture = Texture.from("grass_tile.png");
                break;
            case HOUSE:
                this.sprite.texture = Texture.from("pg_house_tile.png");
                break;
            case TREE:
                this.sprite.texture = Texture.from("tree_1_tile.png");
                break;
            case ROAD:
                this.sprite.texture = Texture.from("road_tile.png");
                break;
        }
    }
}

class Tiles {
    constructor(WIDTH, HEIGHT, STAGE, TILE_DATA) {
        this.stage = STAGE;
        this.tiles_width = WIDTH;
        this.tiles_height = HEIGHT;
        this.tiles_count = WIDTH * HEIGHT;
        
        this.stage.width = WIDTH * TILE_SIZE;
        this.stage.height = HEIGHT * TILE_SIZE;
        
        this.tiles = [];
        
        this.populateTiles(TILE_DATA);
        this.addToStage();
    }
    
    addToStage() {
        let width_index, height_index, index;
        for (height_index = 0; height_index < this.tiles_height; height_index++) {
            for (width_index = 0; width_index < this.tiles_width; width_index++) {
                index = height_index * this.tiles_width + width_index;
                this.tiles[index].sprite.position = ({x: width_index * TILE_SIZE, y: height_index * TILE_SIZE});
                this.stage.addChild(this.tiles[index].sprite);
            }
        }
    }
    
    populateTiles(TILE_DATA) {
        let index;
        for (index = 0; index < this.tiles_count; index++) {
            this.tiles.push(new Tile(TILE_DATA.shift()));
        }
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
         * Stage <- MatchGameScene <- Matching Game (multiple)
         */
        this.stage.addChild(new Sprite(Texture.from("backdrop.png")));
        
        this.background = new Container();
        this.stage.addChild(this.background);
        
        this.houses = new Container();
        this.stage.addChild(this.houses);
        
        this.foreground = new Container();
        this.stage.addChild(this.foreground);
        
        this.matchGameScene = new Container();
        this.stage.addChild(this.matchGameScene);
        
        // Player character
        this.ghost;
        this.ghost_walking;
        this.ghost_stand_anim = Loader.shared.resources["ghost.json"].spritesheet.animations["ghost-stand"];
        this.ghost_walk_anim = Loader.shared.resources["ghost.json"].spritesheet.animations["ghost-walk"];
        
        // Array of houses
        this.houseArray = [];
        this.tiles;

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
    mousedownEventHandler(THIS) {
        return function (event) {
            let move_x = event.offsetX;
            let move_y = event.offsetY;
            let remainder_x = 0;
            let remainder_y = 0;
      
            if (move_x < BOUND_LEFT) {
                remainder_x = move_x - BOUND_LEFT;
                if (THIS.background.position.x + remainder_x < 0) {
                    remainder_x = 0 - THIS.background.position.x;
                }
                move_x = BOUND_LEFT;
            }
            else if (move_x > BOUND_RIGHT) {
                remainder_x = BOUND_RIGHT - move_x;
                if (THIS.background.position.x + remainder_x < THIS.width - THIS.stage.width) {
                    remainder_x = THIS.width - THIS.stage.width - THIS.background.position.x;
                }
                move_x = BOUND_RIGHT;
            }
            if (move_y < BOUND_TOP) {
                remainder_y = move_y - BOUND_TOP;
                if (THIS.background.position.y + remainder_y < 0) {
                    remainder_y = 0 - THIS.background.position.y;
                }
                move_y = BOUND_TOP;
            }
            else if (move_y > BOUND_BOTTOM) {
                remainder_y = BOUND_BOTTOM - move_y;
                if (THIS.background.position.y + remainder_y < THIS.height - THIS.stage.height) {
                    remainder_y = THIS.height - THIS.stage.height - THIS.background.position.y;
                }
                move_y = BOUND_BOTTOM;
            }
            
            THIS.moveGhost(move_x, move_y);
            THIS.moveBG(remainder_x, remainder_y);
        }
    }
    
    moveBG(OFFSET_X, OFFSET_Y) {
        createjs.Tween.get(this.background.position).to({x: this.background.position.x + OFFSET_X, y: this.background.position.y + OFFSET_Y}, TWEEN_SPEED);
    }
    
    // Handles "movement" of the player
    moveGhost(NEW_X, NEW_Y) {
        createjs.Tween.get(this.ghost_walking.position).to({x: NEW_X, y: NEW_Y}, TWEEN_SPEED);
    }
    
    removeMouseListener() {
        let target = document.getElementById("gameport");
        target.removeEventListener("mousedown", this.functionOnClick);
    }

    // Resets game back to starting state
    resetGame() {
        //this.scrollingBG.tilePosition = ({x: 0, y: 0});
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
    
    // Start a new matching game mini game
    runMatchingGame(THIS) {
        let matchGame = new matchingGame(THIS.matchGameScene);
        console.log(matchGame.startGame());
    }
    
    // Add a mouse listener to the game
    setMouseListener() {
        this.functionOnClick = this.mousedownEventHandler(this);
        let target = document.getElementById("gameport");
        target.addEventListener("mousedown", this.functionOnClick);
    }
    
    // Various tasks for setting up the game
    setup() {
        this.loadAssets();
        this.setupScrollingBG();
        this.setupGhost();
    }
    
    // Add the player character (a ghost)
    setupGhost() {
        this.ghost = new AnimatedSprite(this.ghost_stand_anim);
        this.ghost_walking = new AnimatedSprite(this.ghost_walk_anim);
        this.ghost.animationSpeed = ANIM_SPEED;
        this.ghost_walking.animationSpeed = ANIM_SPEED;
        this.ghost.play();
        this.ghost_walking.play();
        this.ghost.position = ({x: GHOST_X, y: GHOST_Y});
        //this.foreground.addChild(this.ghost);

        this.ghost_walking.position = ({x: GHOST_X, y: GHOST_Y});
        this.foreground.addChild(this.ghost_walking);
        //this.ghost_walking.visible = false;
    }
    
    // Add a scrolling background
    setupScrollingBG() {
        //this.background.addChild(this.scrollingBG);
        
        this.tile_data = [
            GRASS, GRASS, GRASS,
            TREE, HOUSE, TREE,
            ROAD, ROAD, ROAD,
            TREE, HOUSE, TREE,
            GRASS, GRASS, GRASS
        ];
        
        this.tiles = new Tiles(3, 5, this.background, this.tile_data);
        
        this.background.position.x = this.width / 2 - this.background.width / 2;
        this.background.position.y = this.height / 2 - this.background.height / 2;
    }
    
    toggleGhostAnim() {
        this.ghost.visible = !this.ghost.visble;
        this.ghost_walking.visible = !this.ghost_walking.visible;
    }
}
