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
const PADDING = 150;
const TWEEN_SPEED = 1000;

const TILE_SIZE = 300;
const GRASS = 10;
const HOUSE = 11;
const ROAD = 12;
const TREE = 13;

// ####################################### CLASSES ############################

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
    
    createSprite() {
        switch(this.description) {
            case GRASS:
                this.sprite.texture = Texture.from("grass_tile.png");
                break;
            case HOUSE:
                this.sprite.texture = Texture.from("pg_house_tile.png");
                this.light_on = true;
                this.light.texture = Texture.from("light.png");
                break;
            case TREE:
                this.sprite.texture = Texture.from("tree_1_tile.png");
                break;
            case ROAD:
                this.sprite.texture = Texture.from("road_tile.png");
                break;
        }
    }
    
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

        this.BOUND_LEFT = PADDING;
        this.BOUND_RIGHT = this.width - PADDING;
        this.BOUND_TOP = PADDING;
        this.BOUND_BOTTOM = this.height - PADDING;
        
        this.atHouse = false;
        this.canMove = true;
        this.gameActive = true;
        
        // Houses completed vs goal
        this.completed = 0;
        this.goal = 5;

        // Scene Graph
        /*
         * Stage <- Backdrop (non scrolling)
         * Stage <- Background <- Scrolling Background
         * Stage <- Foreground <- Ghost, UI
         * Stage <- MatchGameScene <- Matching Game (multiple)
         */
        this.background = new Container();
        this.stage.addChild(this.background);
        
        this.foreground = new Container();
        this.stage.addChild(this.foreground);
        
        this.matchGameScene = new Container();
        this.stage.addChild(this.matchGameScene);
        
        // Player character
        this.ghost;
        this.ghost_walking;
        this.ghost_stand_anim = Loader.shared.resources["ghost.json"].spritesheet.animations["ghost-stand"];
        this.ghost_walk_anim = Loader.shared.resources["ghost.json"].spritesheet.animations["ghost-walk"];
        this.GHOST_X = this.width / 2;
        this.GHOST_Y = this.height / 2;
        
        this.tiles;

        // Class property to represent the function so that it can be removed
        this.functionOnClick;

        // Setup the stage with the assets
        this.setup();
    }
    
    checkForHouse() {
        let index = this.tiles.getIndexAtLocation(this.ghost_walking.position.x, this.ghost_walking.position.y)
        let tile_type = this.tiles.getTileTypeAtLocation(index);
        let houseActive = this.tiles.getTileAtLocation(index).isLightOn();
        if (tile_type === HOUSE && houseActive) {
            this.ghost_walking.stop();
            this.ghost_walking.texture = Texture.from("ghost-pumpkin.png");
            this.atHouse = true;
        }
        else {
            this.ghost_walking.textures = this.ghost_walk_anim;
            this.ghost_walking.play();
            this.atHouse = false;
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

    // Handles all the mouse clicking in-game
    mousedownEventHandler(THIS) {
        return function (event) {
            // Check if activating house
            if (THIS.atHouse) {
                THIS.runMatchingGame(THIS);
                THIS.atHouse = false;
            }
            // Do movement
            else if (THIS.canMove) {
                THIS.togglePause();
                let move_x = event.offsetX;
                let move_y = event.offsetY;
                let remainder_x = 0;
                let remainder_y = 0;

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
    
    moveBG(OFFSET_X, OFFSET_Y) {
        createjs.Tween.get(this.background.position).to({x: this.background.position.x + OFFSET_X, y: this.background.position.y + OFFSET_Y}, TWEEN_SPEED);
    }
    
    // Handles "movement" of the player
    moveGhost(NEW_X, NEW_Y) {
        createjs.Tween.get(this.ghost_walking.position).to({x: NEW_X, y: NEW_Y}, TWEEN_SPEED).call(onComplete, [this]);
        function onComplete(THIS) {
            THIS.checkForHouse();
            THIS.togglePause();
        }
    }
    
    removeMouseListener() {
        let target = document.getElementById("gameport");
        target.removeEventListener("mousedown", this.functionOnClick);
    }

    // Resets game back to starting state
    resetGame() {
        this.ghost_walking.position = ({x: this.GHOST_X, y: this.GHOST_Y});
        
        this.completed = 0;
        this.gameActive = true;
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
        
        let index = THIS.tiles.getIndexAtLocation(THIS.ghost_walking.x, THIS.ghost_walking.y);
        THIS.tiles.getTileAtLocation(index).turnOffLight();
        
        THIS.checkForHouse();
    }
    
    // Add a mouse listener to the game
    setMouseListener() {
        this.functionOnClick = this.mousedownEventHandler(this);
        let target = document.getElementById("gameport");
        target.addEventListener("mousedown", this.functionOnClick);
    }
    
    // Various tasks for setting up the game
    setup() {
        this.setupScrollingBG();
        this.setupGhost();
    }
    
    // Add the player character (a ghost)
    setupGhost() {
        this.ghost = new AnimatedSprite(this.ghost_stand_anim);
        this.ghost.animationSpeed = ANIM_SPEED;
        this.ghost.play();
        this.ghost.position = ({x: this.GHOST_X, y: this.GHOST_Y});
        //this.foreground.addChild(this.ghost);
        
        this.ghost_walking = new AnimatedSprite(this.ghost_walk_anim);
        this.ghost_walking.animationSpeed = ANIM_SPEED;
        this.ghost_walking.play();
        this.ghost_walking.anchor.set(0.5);
        this.ghost_walking.position = ({x: this.GHOST_X, y: this.GHOST_Y});
        this.foreground.addChild(this.ghost_walking);
        //this.ghost_walking.visible = false;
    }
    
    // Add a scrolling background
    setupScrollingBG() {        
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

    togglePause() {
        this.canMove = !this.canMove;
    }
}
