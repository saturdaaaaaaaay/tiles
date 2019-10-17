//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
//var renderer = PIXI.autoDetectRenderer(200, 500, {backgroundColor: 0x000000});
var app = new PIXI.Application({width: 800, height: 500});
gameport.appendChild(app.view);

//scene graphs
var titleScene;
var gameScene;
var creditScene;
var menuScene;

var newgame;

//title text (this stuff's temporary)
var titleText;
var startText;

PIXI.Loader.shared.add("assets.json").load(setup);

//set up game
function setup()
{
  titleScene = new PIXI.Container();
  gameScene = new PIXI.Container();

  newgame = new GameController(gameScene, 800, 500);

  app.stage.addChild(titleScene);
  app.stage.addChild(gameScene);

  gameScene.visible = false;

  titleSetup();
  gameSetup();
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
  var menuText =  new PIXI.Text("Menu", {fill : 0xff1010});

  gameScene.addChild(menuText);
}

function dispGame()
{
  titleScene.visible = false;
  gameScene.visible = true;
  //menuScene.visible = false;
  newgame.runGame();
}

function animate()
{
  requestAnimationFrame(animate);
}
animate();
