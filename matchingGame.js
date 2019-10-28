class matchingGame
{
	constructor(container)
	{
		this.matching_container = new PIXI.Container();
		this.existing_stage = container;
		//this.existing_stage.addChild(this.matching_container);
		
		this.game_finished = false;
		this.score = 5;
		
		this.cards = [];
		this.flipped_cards = 0;
		this.remaining_cards = 6;
	}
	
	startGame()
	{
		setBoard();
		/*
		// do this in the animate loop
		while (this.remaining_cards > 0)
		{
			playGame();
		}
		*/
		//playGame();
		return this.score;
	}
	
	playGame()
	{
		// will contain logic for the matching game
		// set this to a variable and loop until it's done? or just put a loop in startGame()?
		// check user input until it's done, will need to end that so we're not using up computer resources
		
		if (this.flipped_cards === 2)
		{
			checkForMatch();
		}
		if (this.remaining_cards === 0)
		{
			break;
		}
	}
	
	setBoard()
	{
		this.card_types = ["cat", "wolf", "tree"];
		this.card_type_numbers = [0, 0, 0];
		this.cards = 0;
		
		while (this.cards < 6)
		{
			this.random_card = Math.round(((Math.random()) * 2) + 1);
			
			if (this.random_card === 1)
			{
				// make cat
				if (this.cards[0] < 2)
				{
					this.new_card = new Card("cat");
					this.cards.push(this.new_card);
					this.card_type_numbers[0] += 1;
					this.matching_container.addChild(this.card_front);
				}
			}
			else if (this.random_card === 2)
			{
				// make wolf
				if (this.cards[1] < 2)
				{
					this.new_card = new Card("wolf");
					this.cards.push(this.new_card);
					this.card_type_numbers[1] += 1;
					this.matching_container.addChild(this.card_front);
				}
			}
			else (this.random_card === 3)
			{
				// make tree
				if (this.cards[2] < 2)
				{
					this.new_card = new Card("tree");
					this.cards.push(this.new_card);
					this.card_type_numbers[2] += 1;
					this.matching_container.addChild(this.card_front);
				}
			}
		}
		
		this.cards[0].position.x = 20;
		this.cards[0].position.y = 20;
		
		this.cards[1].position.x = 200;
		this.cards[1].position.y = 200;
		
		// need 6 total cards
		// need to check that 2 of each card exist, so use random to choose between 1-3 to randomly select the card type
		// if that card type already has 2, then run again
		// need to place the cards in the proper position here too
		
		checkForMatch(card_1, card_2)
		{
			this.card_1_type = this.card_1.card_type;
			this.card_2_type = this.card_2.card_type;
			
			if (this.card_1_type === this.card_2_type)
			{
				this.card_1.visible = false;
				this.card_2.visible = false;
				
				this.remaining_cards = this.remaining_cards - 2;
				this.flipped_cards = 0;
			}
			else
			{
				this.card_1.flipCard();
				this.card_2.flipCard();
				
				this.flipped_cards = 0;
			}
		}
		
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



class Card
{	
	constructor(type_input)
	{
		this.card_type = type_input;
		this.flipped = false;
		this.times_flipped = 0;
		
		//this.cat_pic = PIXI.Texture.fromImage("Sprites/cat.png");
		this.cat_pic = PIXI.Texture.fromImage("bird-100px-copy.png");
		this.wolf_pic = PIXI.Texture.fromImage("Sprites/wolf.png");
		this.tree_pic = PIXI.Texture.fromImage("Sprites/tree.png");
		//this.pumpkin = PIXI.Texture.fromImage("Sprites/pumpkin");
		this.pumpkin = PIXI.Texture.fromImage("beetle.png");
		
		this.card_front;
		this.card_back = new PIXI.Sprite(pumpkin);
		this.card_pic;
		
		if (type_input === "cat")
		{
			this.card_front = new PIXI.Sprite(cat_pic);
			this.card_pic = "cat";
		}
		else if (type_input === "wolf")
		{
			this.card_front = new PIXI.Sprite(wolf_pic);
			this.card_pic = "wolf";
		}
		else
		{
			this.card_front = new PIXI.Sprite(tree_pic);
			this.card_pic = "tree";
		}		
	}
	
	flipCard()
	{
		if (this.flipped === false)
		{
			// look up visible property for sprites
			this.flipped = true;
			this.matching_container.addChild(this.card_front);
		}
		else
		{
			this.flipped = false;
			this.matching_container.removeChild(this.card_front);
			this.matching_container.addChild(this.card_back);
		}
	}
	
}