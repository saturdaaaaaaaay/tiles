class matchingGame
{
	constructor(container)
	{
		this.matching_container = new PIXI.Container();
		this.existing_stage = container;
		this.existing_stage.addChild(this.matching_container);
		
		this.game_finished = false;
		this.score = 5;
		this.flipped_cards = 0;
	}
	
	startGame()
	{
		//setBoard();
		//playGame();
		return this.score;
	}
	
	playGame()
	{
		// will contain logic for the matching game
		
		if (this.flipped_cards === 2)
		{
			checkForMatch();
		}
	}
	
	setBoard()
	{
		this.card_types = ["cat", "wolf", "tree"];
		this.card_type_numbers = [0, 0, 0];
		this.cards = 0;
		
		while (this.cards <= 6)
		{
			this.random_card = Math.round(((Math.random()) * 2) + 1);
		}
		
		// need 6 total cards
		// need to check that 2 of each card exist, so use random to choose between 1-3 to randomly select the card type
		// if that card type already has 2, then run again
		// need to place the cards in the proper position here too
		
		
	}
	
	/*
	this.getUserInput = setInterval(function(){
		if (bug_count >= 5)
		{
			bug_x_square = Math.round(((Math.random()) * 7) + 1);
			bug_y_square = Math.round(((Math.random()) * 7) + 1);
	
			new_bug_x = bug_x_square * 40 + 20;
			new_bug_y = bug_y_square * 40 + 20;
		
			createjs.Tween.get(bug).to({x: new_bug_x, y: new_bug_y}, 1000).call(tweenFinish, [new_bug_x, new_bug_y]);
		}
	}, 3000);
	*/
	
	
}



class card
{	
	constructor(type_input)
	{
		this.card_type = type_input;
		this.flipped = false;
		this.times_flipped = 0;
		
		this.cat_pic = PIXI.Texture.fromImage("Sprites/cat");
		this.wolf_pic = PIXI.Texture.fromImage("Sprites/wolf");
		this.tree_pic = PIXI.Texture.fromImage("Sprites/tree");
		this.pumpkin = PIXI.Texture.fromImage("Sprites/pumpkin");
		
		this.card_front;
		this.card_back = new PIXI.Sprite(pumpkin);
		
		if (type_input === "cat")
		{
			this.card_front = new PIXI.Sprite(cat_pic);
		}
		else if (type_input === "wolf")
		{
			this.card_front = new PIXI.Sprite(wolf_pic);
		}
		else
		{
			this.card_front = new PIXI.Sprint(tree_pic);
		}
		
		this.matching_container.addChild(this.card_back);
		
	}
	
	flipCard()
	{
		if (this.flipped === false)
		{
			// look up visible property for sprites
		}
		else
		{
			
		}
	}
	
}