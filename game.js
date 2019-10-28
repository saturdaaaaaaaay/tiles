//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
var app = new PIXI.Application({width: 800, height: 500});
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

//game over text
var gameOverText;

var fillerText = new PIXI.Text("Filler", {fill : 0xff1010});

//menu select sound effect
PIXI.sound.add("selectNoise", "select.mp3");

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

  newgame = new GameController(gameScene, 800, 500);

  app.stage.addChild(titleScene);
  app.stage.addChild(gameScene);
  app.stage.addChild(menuScene);
  app.stage.addChild(howToPlayScene);
  app.stage.addChild(creditScene);
  app.stage.addChild(gameOverScene);

  gameScene.visible = false;
  menuScene.visible = false;
  gameOverScene.visible = false;
  howToPlayScene.visible = false;
  creditScene.visible = false;

  titleSetup();
  howToPlaySetup();
  creditSetup();
  gameSetup();
  menuSetup();
  gameOverSetup();
}

function titleSetup()
{
  titleText = new PIXI.Text("Untitled Trick or Treat Game", {fill : 0xff1010});
  /*
  startText = new PIXI.Text("Start", {fill : 0xff1010});
  howToPlayText = new PIXI.Text("How to play", {fill : 0xff1010});
  creditText = new PIXI.Text("Credits", {fill : 0xff1010});
  */

  startText = new PIXI.Sprite(PIXI.Texture.fromFrame("play.png"));
  howToPlayText = new PIXI.Sprite(PIXI.Texture.fromFrame("howtoplay.png"));
  creditText = new PIXI.Sprite(PIXI.Texture.fromFrame("credits.png"));

  titleScene.addChild(titleText);
  titleScene.addChild(startText);
  titleScene.addChild(howToPlayText);
  titleScene.addChild(creditText);

  titleText.position.x = 200;
  titleText.position.y = 50;
  startText.position.x = 200;
  startText.position.y = 100;
  howToPlayText.position.x = 200;
  howToPlayText.position.y = 200;
  creditText.position.x = 200;
  creditText.position.y = 300;

  startText.interactive = true;
  startText.buttonMode = true;
  howToPlayText.interactive = true;
  howToPlayText.buttonMode = true;
  creditText.interactive = true;
  creditText.buttonMode = true;

  startText.on('mousedown', dispGame);
  howToPlayText.on('mousedown', dispHowToPlay);
  creditText.on('mousedown', dispCredits);
}

function gameSetup()
{
  //newgame.runGame();
  //menuText =  new PIXI.Text("Menu", {fill : 0x000000});
  menuText = new PIXI.Sprite(PIXI.Texture.fromFrame("menu.png"));

  gameScene.addChild(menuText);

  menuText.position.x = 700;
  menuText.position.y = 20;

  menuText.interactive = true;
  menuText.buttonMode = true;

  menuText.on('mousedown', dispMenu);
}

function menuSetup()
{
  /*
  titleReturnText = new PIXI.Text("Return to title screen", {fill : 0xff1010});
  resetText = new PIXI.Text("Start Over", {fill : 0xff1010});
  howToPlayText = new PIXI.Text("How to play", {fill : 0xff1010});
  exitText = new PIXI.Text("Exit", {fill : 0xff1010});
  */

  titleReturnText = new PIXI.Sprite(PIXI.Texture.fromFrame("return.png"));
  resetText = new PIXI.Sprite(PIXI.Texture.fromFrame("startover.png"));
  howToPlayText = new PIXI.Sprite(PIXI.Texture.fromFrame("howtoplay.png"));
  exitText = new PIXI.Sprite(PIXI.Texture.fromFrame("cancel.png"));

  menuScene.addChild(titleReturnText);
  menuScene.addChild(resetText);
  menuScene.addChild(howToPlayText);
  menuScene.addChild(exitText);

  titleReturnText.position.x = 200;
  titleReturnText.position.y = 200;
  resetText.position.x = 200;
  resetText.position.y = 250;
  howToPlayText.position.x = 200;
  howToPlayText.position.y = 300;
  exitText.position.x = 200;
  exitText.position.y = 350;

  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;
  resetText.interactive = true;
  resetText.buttonMode = true;
  howToPlayText.interactive = true;
  howToPlayText.buttonMode = true;
  exitText.interactive = true;
  exitText.buttonMode = true;

  titleReturnText.on('mousedown', dispTitle);
  resetText.on('mousedown', resetGame);
  howToPlayText.on('mousedown', dispHowToPlay);
  exitText.on('mousedown', dispGame);
}

function howToPlaySetup()
{
  howToPlayScene.addChild(fillerText);
  titleReturnText = new PIXI.Text("Return to title screen", {fill : 0xff1010});

  howToPlayScene.addChild(titleReturnText);

  titleReturnText.position.x = 200;
  titleReturnText.position.y = 400;

  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;

  titleReturnText.on('mousedown', dispTitle);

}

function creditSetup()
{
  howToPlayScene.addChild(fillerText);
  titleReturnText = new PIXI.Text("Return to title screen", {fill : 0xff1010});

  creditScene.addChild(titleReturnText);

  titleReturnText.position.x = 200;
  titleReturnText.position.y = 400;

  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;

  titleReturnText.on('mousedown', dispTitle);
}

function gameOverSetup()
{
  gameOverText = new PIXI.Text("Game Over", {fill : 0xff1010});

  gameOverScene.addChild(gameOverText);
}

function dispTitle()
{
  PIXI.sound.play("selectNoise");
  titleScene.visible = true;
  gameScene.visible = false;
  menuScene.visible = false;
  howToPlayScene.visible = false;
  creditScene.visible = false;

  PIXI.sound.play("selectNoise");
  gameScene.removeChildren();

  gameSetup();
}

function dispGame()
{
  PIXI.sound.play("selectNoise");
  titleScene.visible = false;
  gameScene.visible = true;
  menuScene.visible = false;
  newgame.runGame();
  //gc_newGame(gameScene);

  /*
  gameScene.addChild(menuText);
  menuText.position.x = 720;
  menuText.position.y = 0;
  */
}

function dispHowToPlay()
{
  PIXI.sound.play("selectNoise");
  titleScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = false;
  howToPlayScene.visible = true;
}

function dispCredits()
{
  PIXI.sound.play("selectNoise");
  titleScene.visible = false;
  gameScene.visible = false;
  menuScene.visible = false;
  howToPlayScene.visible = false;
  creditScene.visible = true;
}

function dispMenu()
{
  PIXI.sound.play("selectNoise");
  gameScene.visible = false;
  newgame.stopGame();
  menuScene.visible = true;
}

function dispGameOver()
{
  gameScene.visible = false;
  gameOverScene.visible = true;
}

function resetGame()
{
  PIXI.sound.play("selectNoise");
  //gameScene.removeChildren();
  newgame.runGame();
  //gameSetup();
  dispGame();
}

function checkGameActive() {
  if (!newgame.isActive())
  {
    dispGameOver();
  }
}

function animate()
{
  requestAnimationFrame(animate);
}
animate();
setInterval(checkGameActive, 500);
