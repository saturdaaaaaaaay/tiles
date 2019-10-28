//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
var app = new PIXI.Application({width: 800, height: 500, backgroundColor: 0xffffff});
app.backgroundColor = "0xffffff";
gameport.appendChild(app.view);

//scene graphs
var titleScene;
var gameScene;
var howToPlayScene;
var creditScene;
var menuScene;
var gameOverScene;

//stores the game controller
var newgame;

//title text
var titleText;
var startText;
var howToPlayText;
var creditText;

//game text
var menuText;

//menu text
var titleReturnText;
var resetText;
var exitText;

//credits
var credits;

//game over text
var gameOverText;

//ghost sprite for title scene
var ghost_walk_anim;
var ghost_walking;

var fillerText = new PIXI.Text("Filler", {fill : 0xff1010});

//menu select sound effect
PIXI.sound.add("selectNoise", "select.mp3");

//loads spritesheets
PIXI.Loader.shared
    .add("ghost.json")
    .add("pumpkin.json")
    .add("tileset.json")
    .add("buttons.json")
    .load(setup);

//set up game
function setup()
{
  //set up game scenes
  titleScene = new PIXI.Container();
  gameScene = new PIXI.Container();
  menuScene = new PIXI.Container();
  howToPlayScene = new PIXI.Container();
  creditScene = new PIXI.Container();
  gameOverScene = new PIXI.Container();

  //create GameController
  newgame = new GameController(gameScene, 800, 500);

  //add scene graphs to stage
  app.stage.addChild(titleScene);
  app.stage.addChild(gameScene);
  app.stage.addChild(menuScene);
  app.stage.addChild(howToPlayScene);
  app.stage.addChild(creditScene);
  app.stage.addChild(gameOverScene);

  //set all scene graphs except titleScene to invisible
  gameScene.visible = false;
  menuScene.visible = false;
  gameOverScene.visible = false;
  howToPlayScene.visible = false;
  creditScene.visible = false;

  //set up scene graphs
  titleSetup();
  howToPlaySetup();
  creditSetup();
  gameSetup();
  menuSetup();
  gameOverSetup();
}

//set up title scene
function titleSetup()
{
  //load ghost sprite and play
  ghost_walk_anim = Loader.shared.resources["ghost.json"].spritesheet.animations["ghost-walk"];
  ghost_walking = new PIXI.AnimatedSprite(ghost_walk_anim);
  ghost_walking.animationSpeed = 0.07;
  ghost_walking.play();

  //create buttons/title from spritesheets
  titleText = new PIXI.Text("Untitled Trick or Treat Game", {fill : 0xff1010});
  startText = new PIXI.Sprite(PIXI.Texture.from("play.png"));
  howToPlayText = new PIXI.Sprite(PIXI.Texture.from("howtoplay.png"));
  creditText = new PIXI.Sprite(PIXI.Texture.from("credits.png"));

  //add buttons/title to titleScene
  titleScene.addChild(titleText);
  titleScene.addChild(startText);
  titleScene.addChild(howToPlayText);
  titleScene.addChild(creditText);
  titleScene.addChild(ghost_walking);

  //position buttons/title
  titleText.position.x = 200;
  titleText.position.y = 100;
  startText.position.x = 300;
  startText.position.y = 150;
  howToPlayText.position.x = 275;
  howToPlayText.position.y = 225;
  creditText.position.x = 275;
  creditText.position.y = 300;
  ghost_walking.position.x = 300;

  //turn button sprites into buttons
  startText.interactive = true;
  startText.buttonMode = true;
  howToPlayText.interactive = true;
  howToPlayText.buttonMode = true;
  creditText.interactive = true;
  creditText.buttonMode = true;

  //set up what should happen when buttons are clicked
  startText.on('mousedown', dispGame);
  howToPlayText.on('mousedown', dispHowToPlay);
  creditText.on('mousedown', dispCredits);
}

//set up game scene
function gameSetup()
{
  //start the game
  //but pause it so that mouse clicks are only recognized when game is on screen
  newgame.runGame();
  newgame.stopGame();

  //create menu button from spritesheet
  menuText = new PIXI.Sprite(PIXI.Texture.from("menu.png"));

  //add menu button sprite to game scene
  gameScene.addChild(menuText);

  //position button sprite
  menuText.position.x = 700;
  menuText.position.y = 20;

  //turn button sprite into button
  menuText.interactive = true;
  menuText.buttonMode = true;

  //when clicked, will display menu scene
  menuText.on('mousedown', dispMenu);
}

//set up menu scene
function menuSetup()
{
  //make button sprites from spritesheets
  titleReturnText = new PIXI.Sprite(PIXI.Texture.from("return.png"));
  resetText = new PIXI.Sprite(PIXI.Texture.from("startover.png"));
  howToPlayText = new PIXI.Sprite(PIXI.Texture.from("howtoplay.png"));
  exitText = new PIXI.Sprite(PIXI.Texture.from("cancel.png"));

  //add button sprites to menuScene
  menuScene.addChild(titleReturnText);
  menuScene.addChild(resetText);
  menuScene.addChild(howToPlayText);
  menuScene.addChild(exitText);

  //position button sprites
  titleReturnText.position.x = 200;
  titleReturnText.position.y = 150;
  resetText.position.x = 200;
  resetText.position.y = 225;
  howToPlayText.position.x = 200;
  howToPlayText.position.y = 300;
  exitText.position.x = 200;
  exitText.position.y = 375;

  //make button sprites into buttons
  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;
  resetText.interactive = true;
  resetText.buttonMode = true;
  howToPlayText.interactive = true;
  howToPlayText.buttonMode = true;
  exitText.interactive = true;
  exitText.buttonMode = true;

  //when clicked...
  //titleReturnText goes to title screen
  //resetText resets the game and displays game scenes
  //howToPlayText goes to how to play scenes
  //exitText goes back to game scene
  titleReturnText.on('mousedown', dispTitle);
  resetText.on('mousedown', resetGame);
  howToPlayText.on('mousedown', dispHowToPlay);
  exitText.on('mousedown', dispGame);
}

//set up how to play scene
function howToPlaySetup()
{
  //create instructions and buttons from spritesheet
  howToPlay = new PIXI.Sprite();
  titleReturnText = new PIXI.Sprite(PIXI.Texture.from("return.png"));
  exitText = new PIXI.Sprite(PIXI.Texture.from("cancel.png"));

  //add sprites to howToPlayScene
  howToPlayScene.addChild(howToPlay);
  howToPlayScene.addChild(titleReturnText);
  howToPlayScene.addChild(exitText);

  //position sprites
  titleReturnText.position.x = 100;
  titleReturnText.position.y = 400;
  exitText.position.x = 400;
  exitText.position.y = 400;

  //turn button sprites into buttons
  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;
  exitText.interactive = true;
  exitText.buttonMode = true;

  //go to title scene if return, go to game scene if exit
  titleReturnText.on('mousedown', dispTitle);
  exitText.on('mousedown', dispMenu);
}

function creditSetup()
{
  //create credits and return button sprite from spritesheet
  credits = new PIXI.Sprite();
  titleReturnText = new PIXI.Sprite(PIXI.Texture.from("return.png"));

  //add button sprite to creditScene
  creditScene.addChild(titleReturnText);
  creditScene.addChild(credits);

  //position button sprite and turn into button
  titleReturnText.position.x = 200;
  titleReturnText.position.y = 400;
  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;

  //display title scene if clicked
  titleReturnText.on('mousedown', dispTitle);
}

function gameOverSetup()
{
  //create game over text and return button from spritesheet
  gameOverText = new PIXI.Text("Game Over", {fill : 0xff1010});
  titleReturnText = new PIXI.Sprite(PIXI.Texture.from("return.png"));

  //add game over text and return button to gameOverScene
  gameOverScene.addChild(gameOverText);
  gameOverScene.addChild(titleReturnText);

  //position button sprite and turn into button
  titleReturnText.position.x = 200;
  titleReturnText.position.y = 400;
  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;

  //display title scene if clicked
  titleReturnText.on('mousedown', dispTitle);
}

function dispTitle()
{
  PIXI.sound.play("selectNoise");

  //make title scene visible and others invisible
  titleScene.visible = true;
  gameScene.visible = false;
  menuScene.visible = false;
  howToPlayScene.visible = false;
  creditScene.visible = false;
  gameOverScene.visible = false;

  //set up the game again (resets the game)
  gameSetup();
}

function dispGame()
{
  PIXI.sound.play("selectNoise");

  //make game scene visible and other invisible
  titleScene.visible = false;
  gameScene.visible = true;
  menuScene.visible = false;
  gameOverScene.visible = false;

  //resume the game
  newgame.resumeGame();
}

function dispHowToPlay()
{
  PIXI.sound.play("selectNoise");

  //make how to play scene visible and others invisible
  titleScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = false;
  howToPlayScene.visible = true;
}

function dispCredits()
{
  PIXI.sound.play("selectNoise");

  //make credits scene visible and others invisible
  titleScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = false;
  howToPlayScene.visible = false;
  creditScene.visible = true;
}

function dispMenu()
{
  PIXI.sound.play("selectNoise");

  //hide and pause game
  gameScene.visible = false;
  newgame.stopGame();

  //make menu scene visible and others invisible
  menuScene.visible = true;
  howToPlayScene.visible = false;
}

function dispGameOver()
{
  //make game over scene visible and others invisible
  gameScene.visible = false;
  gameOverScene.visible = true;
}

function resetGame()
{
  PIXI.sound.play("selectNoise");

  //reset the game using GameController's runGame()
  newgame.runGame();
  dispGame(); //display game scene again
}

//checks if game is still active in GameController
function checkGameActive()
{
  //if game is not active...
  if (!newgame.isActive())
  {
    dispGameOver(); //...display game over scene
  }
}

//animates the stage
function animate()
{
  requestAnimationFrame(animate);
}
animate();
setInterval(checkGameActive, 500);
