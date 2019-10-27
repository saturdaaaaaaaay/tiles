//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
var app = new PIXI.Application({width: 800, height: 500});
gameport.appendChild(app.view);

//scene graphs
var titleScene;
var gameScene;
//var creditScene;
var menuScene;
var gameOverScene;

var newgame;

//title text
var titleText;
var startText;

//game text
var menuText;

//menu text
var titleReturnText;
var resetText;
var exitText;

var gameOverText;

//menu select sound effect
PIXI.sound.add("selectNoise", "select.mp3");

PIXI.Loader.shared
    .add("ghost.json")
    .add("tileset.json")
    .load(setup);

//set up game
function setup()
{
  titleScene = new PIXI.Container();
  gameScene = new PIXI.Container();
  menuScene = new PIXI.Container();
  gameOverScene = new PIXI.Container();

  newgame = new GameController(gameScene, 800, 500);

  app.stage.addChild(titleScene);
  app.stage.addChild(gameScene);
  app.stage.addChild(menuScene); //this line breaks the ghost
  app.stage.addChild(gameOverScene);

  gameScene.visible = false;
  menuScene.visible = false;
  gameOverScene.visible = false;

  titleSetup();
  gameSetup();
  menuSetup();
  gameOverSetup();
}

function titleSetup()
{
  titleText = new PIXI.Text("Untitled Trick or Treat Game", {fill : 0xff1010});
  startText = new PIXI.Text("Start", {fill : 0xff1010});

  titleScene.addChild(titleText);
  titleScene.addChild(startText);

  titleText.position.x = 200;
  titleText.position.y = 200;
  startText.position.x = 200;
  startText.position.y = 250;

  startText.interactive = true;
  startText.buttonMode = true;

  startText.on('mousedown', dispGame);
}

function gameSetup()
{
  //newgame.runGame();
  menuText =  new PIXI.Text("Menu", {fill : 0x000000});

  menuText.interactive = true;
  menuText.buttonMode = true;

  menuText.on('mousedown', dispMenu);
}

function menuSetup()
{
  titleReturnText = new PIXI.Text("Return to title screen", {fill : 0xff1010});
  resetText = new PIXI.Text("Start Over", {fill : 0xff1010});
  exitText = new PIXI.Text("Exit", {fill : 0xff1010});

  menuScene.addChild(titleReturnText);
  menuScene.addChild(resetText);
  menuScene.addChild(exitText);

  titleReturnText.position.x = 200;
  titleReturnText.position.y = 200;
  resetText.position.x = 200;
  resetText.position.y = 250;
  exitText.position.x = 200;
  exitText.position.y = 300;

  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;
  resetText.interactive = true;
  resetText.buttonMode = true;
  exitText.interactive = true;
  exitText.buttonMode = true;

  titleReturnText.on('mousedown', dispTitle);
  resetText.on('mousedown', resetGame);
  exitText.on('mousedown', dispGame);
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
}

function dispGame()
{
  PIXI.sound.play("selectNoise");
  titleScene.visible = false;
  gameScene.visible = true;
  menuScene.visible = false;
  newgame.runGame();
  //gc_newGame(gameScene);


  gameScene.addChild(menuText);
  menuText.position.x = 720;
  menuText.position.y = 0;
}

function dispMenu()
{
  PIXI.sound.play("selectNoise");
  gameScene.visible = false;
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
  newgame.runGame();
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
