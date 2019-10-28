// gamecontroller.js

/*
 * Use of tiles: in classes Tile and Tiles, and in
 *  GameController.setupScrollingBG()
 * 
 * Use of spritesheets: loaded in game.js, used here
 * 
 * Use of scene graphs and classes: scene graphs are mostly in class
 *  GameController, 4 classes are used in this file
 * 
 * Use of git at: https://github.com/saturdaaaaaaaay/tiles
 */

// Alias Declarations
let AnimatedSprite = PIXI.AnimatedSprite;
let Container = PIXI.Container;
let Loader = PIXI.Loader;
let Sprite = PIXI.Sprite;
let sound = PIXI.sound;
let Texture = PIXI.Texture;

// Global Constants
const ANIM_SPEED = 0.07;    // ghost animation
const PADDING = 150;        // stage padding around border
const TWEEN_SPEED = 1500;   // movement tween animation

const TILE_SIZE = 300;      // tiles are square
const GRASS = 10;           // grass tile
const HOUSE = 11;           // house tile
const ROAD = 12;            // road tile
const TREE = 13;            // tree tile

// ####################################### CLASSES ############################

/*
 * Used to gauge amount of candy collected. Goes from 0% -> 25% -> 50% -> 75%
 */
class Pumpkin {
    constructor() {
        this.filled = 0;
        this.sprite = new Sprite();
        this.fillPumpkin();
    }
    
    // Add candy to the pumpkin
    fillPumpkin() {
        this.sprite.texture = Texture.from("pumpkin-" + this.filled + ".png");
        this.filled++;
    }
    
    resetPumpkin() {
        this.filled = 0;
        this.fillPumpkin();
    }
}

/*
 * Keeps track of different data for one tile. A tile can be grass, house,
 *  tree, or road.
 * 
 * If the tile is a house, it shows a porch light to represent a house that
 *  hasn't been visited yet.
 */
class Tile {
    constructor(TYPE) {
        this.description = TYPE;
        this.light_on = false;
        
        this.container = new Container();
        
        this.sprite = new Sprite();
        this.light = new Sprite();
        this.container.addChild(this.sprite);
        this.container.addChild(this.light);
        
        this.createSprite();
    }
    
    // Gives the appropriate texture for the sprite
    createSprite() {
        switch(this.description) {
            case GRASS:
                this.sprite.texture = Texture.from("grass_tile.png");
                break;
            case HOUSE:
                let house_tex = Texture.from("ro_house_tile.png");
                if (this.flipACoin() === 1) {
                    house_tex = Texture.from("pg_house_tile.png");
                }
                this.sprite.texture = house_tex;
                this.light_on = true;
                this.light.texture = Texture.from("light.png");
                break;
            case TREE:
                let tree_tex = Texture.from("tree_2_tile.png");
                if (this.flipACoin() === 1) {
                    tree_tex = Texture.from("tree_1_tile.png");
                }
                this.sprite.texture = tree_tex;
                break;
            case ROAD:
                this.sprite.texture = Texture.from("road_tile.png");
                break;
        }
    }
    
    // Used to determine if alternate texture is used
    flipACoin() {
        return Math.round(Math.random());
    }
    
    // Retuns GRASS, HOUSE, TREE, or ROAD
    getTileType() {
        return this.description;
    }
    
    isLightOn() {
        return this.light_on;
    }
    
    turnOffLight() {
        this.light.visible = false;
        this.light_on = false;
    }
}

/*
 * Keeps track of the data structure for the tiles. Holds instances of class
 *  Tile in an array.
 */
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
                this.tiles[index].container.position = ({x: width_index * TILE_SIZE, y: height_index * TILE_SIZE});
                this.stage.addChild(this.tiles[index].container);
            }
        }
    }
    
    // Return the index of the tile that the ghost is standing on
    getIndexAtLocation(X, Y) {
        let abs_x = X - this.stage.position.x;
        let abs_y = Y - this.stage.position.y;

        return Math.floor(abs_x / TILE_SIZE) + Math.floor(abs_y / TILE_SIZE) * this.tiles_width;
    }
    
    getTileAtLocation(INDEX) {
        return this.tiles[INDEX];
    }

    getTileTypeAtLocation(INDEX) {
        return this.getTileAtLocation(INDEX).getTileType();
    }
    
    // Allows for tile data to be imported
    populateTiles(TILE_DATA) {
        let index;
        for (index = 0; index < this.tiles_count; index++) {
            this.tiles.push(new Tile(TILE_DATA.shift()));
        }
    }
}

/*
 * Main class for the trick or treat part of the game. To use, make an
 *  instance and call runGame(). This class will automatically reset the
 *  game state every time runGame() is called.
 */
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

        // Don't let the player reach the edges
        this.BOUND_LEFT = PADDING;
        this.BOUND_RIGHT = this.width - PADDING;
        this.BOUND_TOP = PADDING;
        this.BOUND_BOTTOM = this.height - PADDING;
        
        // Is the player currently at a house
        this.atHouse = false;
        // Can the player move?
        this.canMove = true;
        // Is the game in the active state?
        this.gameActive = true;
        
        // Houses completed vs goal
        this.completed = 0;
        this.goal = 4;

        // A Scene Graph
        /*
         * A container in game.js <- Stage
         * 
         * Stage <- Background <- Scrolling Background (tiles)
         * Stage <- Foreground <- Ghost
         * Stage <- UI <- Pumpkin
         * Stage <- MatchGameScene <- Matching Game instances
         */
        this.background = new Container();
        this.stage.addChild(this.background);
        
        this.foreground = new Container();
        this.stage.addChild(this.foreground);
        
        this.ui = new Container();
        this.stage.addChild(this.ui);
        
        this.matchGameScene = new Container();
        this.stage.addChild(this.matchGameScene);
        
        // Load sounds
        sound.add("footsteps", "audio/footsteps.mp3");
        sound.add("background", "audio/background.mp3");
        sound.add("trickortreat", "audio/trickortreat.mp3");
        
        // Player character as a ghost
        this.ghost;             // Not currently used
        this.ghost_walking;
        this.ghost_stand_anim = Loader.shared.resources["ghost.json"].spritesheet.animations["ghost-stand"];    // Not used
        this.ghost_walk_anim = Loader.shared.resources["ghost.json"].spritesheet.animations["ghost-walk"];
        this.GHOST_X = this.width / 2;
        this.GHOST_Y = this.height / 2;
        
        // Pumpkin gauge for candy amount
        this.pumpkin;
        
        // Class reference to the tiling
        this.tiles;

        // Class property to represent the function so that it can be removed
        this.functionOnClick;

        // Setup the stage with the assets
        this.setup();
    }

    // Add a mouse listener to the game
    addMouseListener() {
        this.functionOnClick = this.mousedownEventHandler(this);
        let target = document.getElementById("gameport");
        target.addEventListener("mousedown", this.functionOnClick);
    }
    
    // Find out if the player is standing on a house tile
    checkForHouse() {
        let index = this.tiles.getIndexAtLocation(this.ghost_walking.position.x, this.ghost_walking.position.y)
        let tile_type = this.tiles.getTileTypeAtLocation(index);
        let houseActive = this.tiles.getTileAtLocation(index).isLightOn();
        
        // On a house tile
        if (tile_type === HOUSE && houseActive) {
            this.ghost_walking.stop();
            this.ghost_walking.texture = Texture.from("ghost-pumpkin.png");
            this.atHouse = true;
        }
        // Not a house tile
        else {
            this.ghost_walking.textures = this.ghost_walk_anim;
            this.ghost_walking.play();
            this.atHouse = false;
        }
    }

    // Used to check if the game has ended
    checkGameEnd(THIS) {
        THIS.gameActive = !(THIS.completed === THIS.goal);
        if (!THIS.gameActive) {
            THIS.stopGame();
        }
    }

    // Method to return if game is active
    isActive() {
        return this.gameActive;
    }

    // Handles all the mouse clicking in-game
    mousedownEventHandler(THIS) {
        return function (event) {
            
            // Check if activating a house
            if (THIS.atHouse) {
                THIS.runMatchingGame(THIS);
                THIS.atHouse = false;
                THIS.completed++;
                THIS.checkGameEnd(THIS);
                THIS.pumpkin.fillPumpkin();
            }
            
            // Do movement instead
            else if (THIS.canMove) {
                THIS.togglePause();
                let move_x = event.offsetX;
                let move_y = event.offsetY;
                let remainder_x = 0;
                let remainder_y = 0;

                // Player can only reach the boundaries. After that, move
                // the background the rest of the way
                if (move_x < THIS.BOUND_LEFT) {
                    remainder_x = THIS.BOUND_LEFT - move_x;
                    if (THIS.background.position.x + remainder_x > 0) {
                        remainder_x = 0 - THIS.background.position.x;
                    }
                    move_x = THIS.BOUND_LEFT;
                } else if (move_x > THIS.BOUND_RIGHT) {
                    remainder_x = THIS.BOUND_RIGHT - move_x;
                    if (THIS.background.position.x + remainder_x < THIS.width - THIS.stage.width) {
                        remainder_x = THIS.width - THIS.stage.width - THIS.background.position.x;
                    }
                    move_x = THIS.BOUND_RIGHT;
                }
                if (move_y < THIS.BOUND_TOP) {
                    remainder_y = THIS.BOUND_TOP - move_y;
                    if (THIS.background.position.y + remainder_y > 0) {
                        remainder_y = 0 - THIS.background.position.y;
                    }
                    move_y = THIS.BOUND_TOP;
                } else if (move_y > THIS.BOUND_BOTTOM) {
                    remainder_y = THIS.BOUND_BOTTOM - move_y;
                    if (THIS.background.position.y + remainder_y < THIS.height - THIS.stage.height) {
                        remainder_y = THIS.height - THIS.stage.height - THIS.background.position.y;
                    }
                    move_y = THIS.BOUND_BOTTOM;
                }

                THIS.moveGhost(move_x, move_y);
                THIS.moveBG(remainder_x, remainder_y);
            }
        }
    }
    
    // Handles movement of the background
    moveBG(OFFSET_X, OFFSET_Y) {
        createjs.Tween.get(this.background.position).to({x: this.background.position.x + OFFSET_X, y: this.background.position.y + OFFSET_Y}, TWEEN_SPEED);
    }
    
    // Handles movement of the player
    moveGhost(NEW_X, NEW_Y) {
        // Make sure the player sprite is facing an appropriate direction
        if (NEW_X < this.ghost_walking.position.x) {
            this.ghost_walking.scale.x = -1;
        }
        else if (NEW_X > this.ghost_walking.position.x) {
            this.ghost_walking.scale.x = 1;
        }
        
        // Movement
        sound.play("footsteps");
        createjs.Tween.get(this.ghost_walking.position).to({x: NEW_X, y: NEW_Y}, TWEEN_SPEED).call(onComplete, [this]);
        // To be completed after the tween is finished
        function onComplete(THIS) {
            THIS.checkForHouse();
            THIS.togglePause();
        }
    }
    
    // Remove the mouse listener
    removeMouseListener() {
        let target = document.getElementById("gameport");
        target.removeEventListener("mousedown", this.functionOnClick);
    }

    // Resets game back to starting state
    resetGame() {
        this.ghost_walking.position = ({x: this.GHOST_X, y: this.GHOST_Y});
        this.setupScrollingBG();
        
        this.atHouse = false;
        this.canMove = true;
        this.gameActive = true;
        this.completed = 0;
        
        this.pumpkin.resetPumpkin();
    }

    // Resume the game when the menu goes away
    resumeGame() {
        this.gameActive = true;
        this.addMouseListener();
        sound.play("background", {loop:true});
    }

    // Start a new game
    runGame() {
        this.resetGame();
        this.addMouseListener();
        sound.play("background", {loop: true});
    }
    
    // Start a new matching game mini game
    runMatchingGame(THIS) {
        // Pause mouse listener
        //THIS.removeMouseListener();
        
        sound.play("trickortreat");
        
        //let matchGame = new matchingGame(THIS.matchGameScene);
        //console.log(matchGame.startGame());
        
        // Deactivate house
        let index = THIS.tiles.getIndexAtLocation(THIS.ghost_walking.x, THIS.ghost_walking.y);
        THIS.tiles.getTileAtLocation(index).turnOffLight();
        
        // Resume mouse listener
        //THIS.addMouseListener();
        
        // Update the house state
        THIS.checkForHouse();
    }
    
    // Various tasks for setting up the game the first time
    setup() {
        this.setupScrollingBG();
        this.setupGhost();
        this.setupPumpkin();
    }
    
    // Add the player character (a ghost)
    setupGhost() {
        // ghost is not working so it isn't used
        this.ghost = new AnimatedSprite(this.ghost_stand_anim);
        this.ghost.animationSpeed = ANIM_SPEED;
        this.ghost.play();
        this.ghost.position = ({x: this.GHOST_X, y: this.GHOST_Y});
        //this.foreground.addChild(this.ghost);
        
        // ghost walking is used as the main sprite
        this.ghost_walking = new AnimatedSprite(this.ghost_walk_anim);
        this.ghost_walking.animationSpeed = ANIM_SPEED;
        this.ghost_walking.play();
        this.ghost_walking.anchor.set(0.5);
        this.ghost_walking.position = ({x: this.GHOST_X, y: this.GHOST_Y});
        this.foreground.addChild(this.ghost_walking);
        //this.ghost_walking.visible = false;
    }
    
    // Add the pumpkin candy gauge to the game
    setupPumpkin() {
        this.pumpkin = new Pumpkin();
        this.pumpkin.sprite.position = ({x: this.width - 100, y: this.height - 100});
        this.ui.addChild(this.pumpkin.sprite);
    }
    
    // Add a scrolling background
    setupScrollingBG() {
        // This tile data could be imported from a file
        this.tile_data = [
            GRASS, GRASS, GRASS, GRASS, GRASS,
            TREE, HOUSE, TREE, HOUSE, TREE,
            ROAD, ROAD, ROAD, ROAD, ROAD,
            TREE, HOUSE, TREE, HOUSE, TREE,
            GRASS, GRASS, GRASS, GRASS, GRASS
        ];
        this.tiles = new Tiles(5, 5, this.background, this.tile_data);
        
        // Place the ghost at the center of the tiles
        this.background.position.x = this.width / 2 - this.background.width / 2;
        this.background.position.y = this.height / 2 - this.background.height / 2;
    }
    
    // Stop the game when a menu is displayed
    stopGame() {
        this.gameActive = false;
        this.removeMouseListener();
        sound.stop("background");
    }
    
    // Not working. Supposed to switch between stationary and moving animations
    toggleGhostAnim() {
        this.ghost.visible = !this.ghost.visble;
        this.ghost_walking.visible = !this.ghost_walking.visible;
    }

    // Toggle if the player can move or not
    togglePause() {
        this.canMove = !this.canMove;
    }
}
