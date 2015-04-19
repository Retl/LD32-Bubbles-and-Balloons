
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var cursors;

var score;
var scoreText;

function preload() {
	game.load.image('sky', './img/grid_800x600.png');
    game.load.image('ground', './img/b_blue.png');
    game.load.image('star', './img/b_red.png');
    game.load.image('grid', './img/grid_800x600.png');
    game.load.image('red', './img/b_red.png');
    // game.load.spritesheet('dude', './img/b_yellow.png', 32, 48);
    game.load.image('dude', './img/b_yellow.png', 32, 48);
}

function create() {

	cursors = game.input.keyboard.createCursorKeys();

	score = 0

	game.add.sprite(0, 0, 'grid');
	game.add.sprite(0, 0, 'star');
	// game.world.height;
	// game.world.width;
	
	// ----------------
	
	//  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(42, 1);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(320, 400, 'ground');
    ledge.scale.setTo(21, 1);

    ledge.body.immovable = true;

    ledge = platforms.create(0, 250, 'ground');
    ledge.scale.setTo(21, 1);

    ledge.body.immovable = true;
	
	// ---------------
	
	// The player and its settings.
	player = game.add.sprite(32, game.world.height - 150, 'dude');
	player.inputEnabled = true;
	player.input.pixelPerfectClick = true;

	// Enable physics on the player.
	game.physics.arcade.enable(player);

	// Player physics properties. Give the guy a slight bounce.
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 10 * 60;

	player.body.collideWorldBounds = true;

	// Two animations: Walking left and walking right.
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);

	// ----------
	stars = game.add.group();

    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 16;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#888'});
    scoreText2 = game.add.text(14, 14, 'score: 0', {fontSize: '36px', fill: '#ddd'});

}

function update() {
	// Allow player and stars to collide against platforms.
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);

	//  Reset the players velocity (movement)
    // player.body.velocity.x = 0;

	player.body.acceleration.x = 0;
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.acceleration.x -= 10*10;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.acceleration.x += 10*10;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        // if player.acceleration.x > 0 {player.acceleration =}

        player.frame = 4;
    }

    //game.physics.arcade.accelerateToPointer(player, game.input.mousePointer, 16*16, 16*16, 0);

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -10*60;
    }

    //  only move when you click
    if (game.input.mousePointer.isDown)
    {
        //  400 is the speed it will move towards the mouse
        game.physics.arcade.moveToPointer(player, 400);

        //  if it's overlapping the mouse, don't move any more
        if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
        {
            player.body.velocity.setTo(0, 0);
        }
    }
    else
    {
        player.body.velocity.setTo(0, 0);
    }
}

function render() {

    game.debug.spriteInputInfo(player, 32, 32);
    game.debug.geom(player.input._tempPoint);

}

function collectStar (player, star) {

	// Get rid of the star.
	star.kill();

	// Update score.
	score += 10;
	scoreText.text = 'Score: ' + score;
	scoreText2.text = scoreText.text;
}
