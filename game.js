//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(800, 500, {backgroundColor: 0x000000});
gameport.appendChild(renderer.view);
var stage = new PIXI.Container();

//scene graphs
var titleScene;
var gameScene;
var creditScene;

//title text (this stuff's temporary)
var titleText;
var startText;

//load spritesheet
PIXI.loader
  .add("assets.json")
  .load(setup);

//set up game
function setup()
{
  titleScene = new PIXI.Container();
  gameScene = new PIXI.Container();

  stage.addChild(titleScene);
  stage.addChild(gameScene);

  gameScene.visible = false;

  titleSetup();
  gameSetup();
}

function animate()
{
  requestAnimationFrame(animate);
  renderer.render(stage);
}
animate();


function reset()
{

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
  var tempText =  new PIXI.Text("Game: coming soon :)", {fill : 0xff1010});

  gameScene.addChild(tempText);
}

function dispGame()
{
  gameScene.visible = true;
  titleScene.visible = false;
}
