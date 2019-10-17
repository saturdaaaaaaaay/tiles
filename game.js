//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
//var renderer = PIXI.autoDetectRenderer(200, 500, {backgroundColor: 0x000000});
var app = new PIXI.Application({width: 800, height: 500});
gameport.appendChild(app.view);

//scene graphs
var titleScene;
var gameScene;
//var creditScene;
var menuScene;

var newgame;

//title text
var titleText;
var startText;

//game text
var menuText;

//menu text
var titleReturnText;
var exitText;

PIXI.Loader.shared.add("assets.json").load(setup);

//set up game
function setup()
{
  titleScene = new PIXI.Container();
  gameScene = new PIXI.Container();
  menuScene = new PIXI.Container();

  newgame = new GameController(gameScene, 800, 500);

  app.stage.addChild(titleScene);
  app.stage.addChild(gameScene);
  app.stage.addChild(menuScene); //this line breaks the ghost

  gameScene.visible = false;
  menuScene.visible = false;

  titleSetup();
  gameSetup();
  menuSetup();
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
  exitText = new PIXI.Text("Exit", {fill : 0xff1010});

  menuScene.addChild(titleReturnText);
  menuScene.addChild(exitText);

  titleReturnText.position.x = 200;
  titleReturnText.position.y = 200;
  exitText.position.x = 200;
  exitText.position.y = 250;

  titleReturnText.interactive = true;
  titleReturnText.buttonMode = true;
  exitText.interactive = true;
  exitText.buttonMode = true;

  titleReturnText.on('mousedown', dispTitle);
  exitText.on('mousedown', dispGame);
}

function dispTitle()
{
  titleScene.visible = true;
  gameScene.visible = false;
  menuScene.visible = false;
}

function dispGame()
{
  titleScene.visible = false;
  gameScene.visible = true;
  menuScene.visible = false;
  newgame.runGame();


  gameScene.addChild(menuText);
  menuText.position.x = 720;
  menuText.position.y = 0;
}

function dispMenu()
{
  gameScene.visible = false;
  menuScene.visible = true;
}

function animate()
{
  requestAnimationFrame(animate);
}
animate();
