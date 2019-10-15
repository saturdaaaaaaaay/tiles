//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(800, 500, {backgroundColor: 0x000000});
gameport.appendChild(renderer.view);
var stage = new PIXI.Container();

//scene graphs
var menuScene;
var gameScene;
var creditScene;

//load spritesheet
PIXI.loader
  //.add("assets.json")
  .load(setup);

//set up game
function setup()
{
  menuScene = new PIXI.Container();
  gameScene = new PIXI.Container();

  stage.addChild(menuScene);
  stage.addChild(gameScene);
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
