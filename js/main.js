window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render});

function preload() {

    game.load.image('ball', 'assets/man.png');
	
	game.load.image('enemy', 'assets/maddy.png');
		game.load.image('back', 'assets/white.jpg');
game.load.audio( 'music', 'assets/scary.mp3');
}

var time;
var lost;
var style;
var ship;
var world;
var cursors;
var bullets;
var alive=true;

 var lives;
 var music;
function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
	 music = game.add.audio('music', 1, true);
        music.play('', 0, 1, true);
	world = game.add.tileSprite(0, 0, 800, 600, 'back');
    bullets = game.add.group();
    for (var i = 0; i < 10; i++) {
        var bullet = bullets.create(game.rnd.integerInRange(200, 1700), game.rnd.integerInRange(-200, 400), 'enemy');
		bullet.scale.setTo(.02,.02);
        game.physics.p2.enable(bullet,false);
    }
    cursors = game.input.keyboard.createCursorKeys();
    ship = game.add.sprite(32, game.world.height - 150, 'ball');
	ship.scale.setTo(.15,.15);
    game.physics.p2.enable(ship);
	
	
	ship.body.onBeginContact.add(blockHit, this);
	 lives = 50;
};

function update() {
	time= (30000-game.time.now)/1000;
    bullets.forEachAlive(moveBullets,this);  //make bullets accelerate to ship

    if (cursors.left.isDown) {ship.body.rotateLeft(100);}   //ship movement
    else if (cursors.right.isDown){ship.body.rotateRight(100);}
    else {ship.body.setZeroRotation();}
    if (cursors.up.isDown){ship.body.thrust(400);}
    else if (cursors.down.isDown){ship.body.reverse(400);}
	
	if(game.time.now>30000&&alive==true)
		{
		ship.kill();
		lost = game.add.text(game.world.centerX, game.world.centerY, "You have escaped!", style);
            lost.anchor.setTo( 0.5, 0.5);
		
		}
};

function blockHit (body, shapeA, shapeB, equation) {

	//	The block hit something
	//	This callback is sent: the Body it collides with
	//	shapeA is the shape in the calling Body involved in the collision
	//	shapeB is the shape in the Body it hit
	//	equation is an array with the contact equation data in it



	
	
	 if(lives > 0)
            lives -= 1;
        
        if(lives <= 0)
        {
           	ship.kill();
       alive=false;
            lost = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!\n Press F5 to restart", style);
            lost.anchor.setTo( 0.5, 0.5);
        }

}
function moveBullets (bullet) { 
     accelerateToObject(bullet,ship,100);  //start accelerateToObject on every bullet
}

function accelerateToObject(obj1, obj2, speed) {
    if (typeof speed === 'undefined') { speed = 30; }
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
    obj1.body.force.y = Math.sin(angle) * speed;
}

function render() {    
        game.debug.text('Lives: ' + lives, 0, 50);
		game.debug.text('Time remaining until the gate opnes: ' + time+' seconds', 0, 100);
    }
};
