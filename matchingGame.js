class matchingGame
{
	constructor(container)
	{
		var matching_container = new PIXI.Container();
		var existing_stage = container;
		existing_stage.addChild(matching_container);
		
		var game_finished = false;
		var score = 5;
	}
	
	function startGame()
	{
		setBoard();
		playGame();
		return score;
	}
	
	function playGame()
	{
		// will contain logic for the matching game
	}
	
	function setBoard()
	{
		const card_types = ["cat", "wolf", "tree"];
		var card_type_numbers = [0, 0, 0];
		var cards = 0;
		
		while (cards <= 6)
		{
			var random_card = Math.round(((Math.random()) * 2) + 1);
		}
		
		// need 6 total cards
		// need to check that 2 of each card exist, so use random to choose between 1-3 to randomly select the card type
		// if that card type already has 2, then run again
		// need to place the cards in the proper position here too
		
		
	}
	
	
}



class card
{	
	constructor(type_input)
	{
		const card_type = type_input;
		var flipped = false;
		var times_flipped = 0;
		
		var cat_pic = PIXI.Texture.fromImage("Sprites/cat");
		var wolf_pic = PIXI.Texture.fromImage("Sprites/wolf");
		var tree_pic = PIXI.Texture.fromImage("Sprites/tree");
		var pumpkin = PIXI.Texture.fromImage("Sprites/pumpkin");
		
		var card_front;
		var card_back = new PIXI.Sprite(pumpkin);
		
		if (type_input === "cat")
		{
			card_front = new PIXI.Sprite(cat_pic);
		}
		else if (type_input === "wolf")
		{
			card_front = new PIXI.Sprite(wolf_pic);
		}
		else
		{
			card_front = new PIXI.Sprint(tree_pic);
		}
		
		matching_container.addChild(card_back);
		
	}
	
	function flipCard()
	{
		if (flipped === false)
		{
				// look up visible property for sprites
		}
		else
		{
			
		}
	}
	
}