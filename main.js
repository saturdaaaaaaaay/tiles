// Dummy file to load the game onto the App

let app = new PIXI.Application({width: 800, height: 500});
renderer = app.renderer;

let gameport = document.getElementById("gameport");
gameport.appendChild(app.view);

stage = new PIXI.Container();

// ###################### START A NEW GAME ###############################

let newgame = new GameController(stage, 800, 500);
newgame.runGame();

// #######################################################################

function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
animate();
