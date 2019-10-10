//set up gameport, renderer, and stage
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(400, 400, {backgroundColor: 0xe6b5eb});
gameport.appendChild(renderer.view);
var stage = new PIXI.Container();

//load spritesheet
PIXI.loader
  //.add("assets.json")
  .load(setup);

//set up game
function setup()
{

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
