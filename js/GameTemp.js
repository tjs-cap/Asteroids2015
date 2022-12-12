//Author: Trevor Smith (2015)
//Asteroids 2015

var game = new Phaser.Game(1280, 800, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('upperConsole','assets/upper_console.png')
    game.load.image('space', 'assets/starscape.jpg');
    game.load.image('ship', 'assets/starship.png');

    //Asteroid Large in its 7 states
    game.load.image('asteroidLarge', 'assets/asteroidLarge.png');
    game.load.image('astLargeLeft', 'assets/asteroidLarge1.png');
    game.load.image('astLargeRight', 'assets/asteroidLarge2.png');
    game.load.image('astLargeTL', 'assets/asteroidLargeTL.png');
    game.load.image('astLargeBL', 'assets/asteroidLargeBL.png');
    game.load.image('astLargeTR', 'assets/asteroidLargeTR.png');
    game.load.image('astLargeBR', 'assets/asteroidLargeBR.png');
    
    //Asteroid Medium in its 3 states
    game.load.image('asteroidMedium', 'assets/asteroidMedium.png');
    game.load.image('astMediumL', 'assets/asteroidMediumL.png');
    game.load.image('astMediumR', 'assets/asteroidMediumR.png');
    
    //Asteroid Small
    game.load.image('asteroidSmall', 'assets/asteroidSmall.png');

    game.load.image('bullet', 'assets/bullets.png');
    game.load.image('bullet2', 'assets/bullets2.png');
//    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('shieldassets', 'assets/shield.png');
    game.load.spritesheet ('explosion', 'assets/explo.png', 256, 256, 48);
    game.load.spritesheet ('asteroidBoom', 'assets/asteroid_explosion.png', 128, 128, 40);
    game.load.spritesheet ('asteroidSmoke', 'assets/smoke.png', 128, 128, 40);
    
    
    game.load.image('superAsteroid', 'assets/superAsteroid.png');
    game.load.image('powerUp', 'assets/power-up2.png');
                           
}

var ship;
var shield = 0;
var shieldCounter;
var shieldText;
var shieldString;
var styleShield;
var explosion;

var lives = 3;
var livesNext = 1000;
var livesString;
var livesText;
var score = 0;
var scoreString;
var scoreText;
var header;

var asteroidsGroup;
var noOfAsteroids;
var maxAsteroids = 1;
var liveAsteroids;

var bullet;
var bullets;
var bulletTime = 0;
var bulletsLevel = 1;

var level = 1;

var enemy;
var enemyCounter = game.rnd.realInRange(10000,30000);

var cursors;
var fireButton;
var stateMessage;

var textMessage;
var textStyle;

var powerUp;
var powerUps;

function create() 
{

    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //  A spacey background
    game.add.tileSprite(0, 0, game.width, game.height, 'space');
        
    createShip();
    
    //  Our ships bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bulletTime = 0;

    //  All 5 of them
    bullets.createMultiple(5, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    createAsteroids();
    
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    header = game.add.group();
    header.add(game.add.sprite(0, 0, 'upperConsole'));
    
    //adding text
    //left side ( -- SCORE --)
    scoreString = "Score:  ";
    var style = { font: "32px Arial Black", fill: "#ffff00" , align: "left" };
    header.add(scoreText= game.add.text(50,17, scoreString + score, style));
    
    //right side ( -- LIVES --)
    livesString = "Lives:  ";
    header.add(livesText = game.add.text(935,17, livesString + lives, style));
    
    //top right (-- SHIELD COUNTER --)
    header.add(game.add.sprite(1150,5, 'shieldassets'));
    styleShield = { font: "90px Arial Black", fill: "#ffff00" , align: "left" };
    header.add(shieldText = game.add.text(1195, 1, shield/100, styleShield));
    
    //bottom left (-- Dev Message --)
    textStyle = { font: "18px Arial", fill: "#ffff00" , align: "left" };
    header.add(textMessage = game.add.text(30, 700, " ", textStyle));

    //header always on top
    game.world.bringToTop (header);
}

function update() {

    liveAsteroids = asteroidsGroup.countLiving();
    
    extraLives();
    shield -=1;
    if(shield < 0) {shield = 0;}
    shieldText.text = Math.round(shield/100).toString();
    
    game.physics.arcade.collide(bullet, asteroidsGroup, collisionHandler, null, this);
    game.physics.arcade.collide(ship, asteroidsGroup, collisionByAsteroid, null, this);
    game.physics.arcade.collide(asteroidsGroup, asteroidsGroup);
    
    
    if(lives > 0) {
    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
    }
    else
    {
        ship.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        ship.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        ship.body.angularVelocity = 300;
    }
    else
    {
        ship.body.angularVelocity = 0;
    }
//    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    if (fireButton.isDown)
    {
        fireBullet();
    }
    
    }
    
    screenWrap(ship);
    asteroidsGroup.forEachExists (screenWrap, this);
    bullets.forEachExists (screenWrap, this);   
}

function render() {
    game.debug.body(asteroidsGroup);
    game.debug.body(bullets);
    
}

function createAsteroids() {
    asteroidsGroup = game.add.group();
    asteroidsGroup.enableBody = true;
    noOfAsteroids = maxAsteroids;

    for (var i = 0; i < noOfAsteroids; i++)
    {
        var rand = 0;
        rand = game.rnd.realInRange(1, 100);
        if(rand < 40) {
            var s = asteroidsGroup.create(game.world.randomX, 0, 'asteroidLarge');
        }
        else if (rand < 70) {
            var s = asteroidsGroup.create(game.world.randomX, 0, 'asteroidMedium');            
        }
        else {
            var s = asteroidsGroup.create(game.world.randomX, 0, 'asteroidSmall');            
        }
        s.anchor.set(0.5);
        s.body.bounce.set(1.2);
        var x = game.rnd.realInRange(-1,1);
        if(x < 0){
            x = -1; }
        else {
            x = 1; }
        s.body.velocity.setTo(game.rnd.realInRange(1,3) * 40 * x, game.rnd.realInRange(1,3) * 40 * x);
        s.body.maxVelocity.set(200);
    }
}

function createShip() {
    //our player ship
    ship = game.add.sprite(640, 400, 'ship');
    ship.anchor.set(0.5);

    // and it's physics settings
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.drag.set(100);
    ship.body.maxVelocity.set(200);
    ship.body.bounce.set(1);
    shield = 300;
    
}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);
        if (bullet)
        {
            
            bullet.reset(ship.body.x + 50, ship.body.y + 31);
            bullet.lifespan = 1000;
            bullet.rotation = ship.rotation;
            game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 200;
        }
    }
}

function collisionHandler (bullet, asteroid) {

    //get asteroid.kill type and position
    var asteroidKey = asteroid.key.toString();
    var asteroidX = asteroid.position.x;
    var asteroidY = asteroid.position.y;
    
    //  When a bullet hits an alien we kill them both
    bullet.kill();
    asteroid.destroy();
    
    score += 20;
    scoreText.text = scoreString + score;
//    liveAsteroids -= 1;
    
    if(asteroidKey == "asteroidLarge") {
        asteroidsGroup.enableBody = true;

        var ast1;
        var ast2;
//        textMessage.text = "Key = " + asteroidKey + "  Pos (x,y) = " + asteroidX + ", " +asteroidY + "  Asteroid Count = " + asteroidsGroup.countLiving();
        ast1 = game.add.sprite(asteroidX,asteroidY, 'astLargeLeft');
        asteroidsGroup.add(ast1);
        ast2 = game.add.sprite(asteroidX + 50,asteroidY, 'astLargeRight');
        asteroidsGroup.add(ast2);

        ast1.anchor.set(0.5);
        ast1.body.bounce.set(1.2);
        ast1.body.velocity.setTo(-50 + game.rnd.realInRange(-3,0) * 20, 50 + game.rnd.realInRange(-2,2) * 20);
        ast1.body.maxVelocity.set(250);

        ast2.anchor.set(0.5);
        ast2.body.bounce.set(1.2);
        ast2.body.velocity.setTo(50 + game.rnd.realInRange(0,3) * 20, 50 + game.rnd.realInRange(-2,2) * 20);
        ast2.body.maxVelocity.set(250);
        
        smokin(asteroidX,asteroidY);

                
 //       textMessage.text = "Key = " + asteroidKey + "  Pos (x,y) = " + asteroidX + ", " +asteroidY + "  Asteroid Count = " + asteroidsGroup.countLiving();
    }
    
    else if(asteroidKey == "astLargeLeft") {
        asteroidsGroup.enableBody = true;

        var ast1;
        var ast2;
//        textMessage.text = "Key = " + asteroidKey + "  Pos (x,y) = " + asteroidX + ", " +asteroidY + "  Asteroid Count = " + asteroidsGroup.countLiving();
        ast1 = game.add.sprite(asteroidX,asteroidY, 'astLargeTL');
        asteroidsGroup.add(ast1);
        ast2 = game.add.sprite(asteroidX,asteroidY, 'astLargeBL');
        asteroidsGroup.add(ast2);

        ast1.anchor.set(0.5);
        ast1.body.bounce.set(1.2);
        ast1.body.velocity.setTo( game.rnd.realInRange(-2,2) * 30, game.rnd.realInRange(-4,0) * 30);
        ast1.body.maxVelocity.set(250);

        ast2.anchor.set(0.5);
        ast2.body.bounce.set(1.2);
        ast2.body.velocity.setTo(50 + game.rnd.realInRange(-2,2) * 20, 50 + game.rnd.realInRange(0,4) * 20);
        ast2.body.maxVelocity.set(250);

        smokin(asteroidX,asteroidY);
                
//        textMessage.text = "Key = " + asteroidKey + "  Pos (x,y) = " + asteroidX + ", " +asteroidY + "  Asteroid Count = " + asteroidsGroup.countLiving();
    }
    
    else if(asteroidKey == "astLargeRight") {
        asteroidsGroup.enableBody = true;

        var ast1;
        var ast2;
//        textMessage.text = "Key = " + asteroidKey + "  Pos (x,y) = " + asteroidX + ", " +asteroidY + "  Asteroid Count = " + asteroidsGroup.countLiving();
        ast1 = game.add.sprite(asteroidX,asteroidY, 'astLargeTR');
        asteroidsGroup.add(ast1);
        ast2 = game.add.sprite(asteroidX,asteroidY, 'astLargeBR');
        asteroidsGroup.add(ast2);

        ast1.anchor.set(0.5);
        ast1.body.bounce.set(1.2);
        ast1.body.velocity.setTo( game.rnd.realInRange(-2,2) * 30, game.rnd.realInRange(-4,0) * 30);
        ast1.body.maxVelocity.set(250);

        ast2.anchor.set(0.5);
        ast2.body.bounce.set(1.2);
        ast2.body.velocity.setTo(50 + game.rnd.realInRange(-2,2) * 20, 50 + game.rnd.realInRange(0,4) * 20);
        ast2.body.maxVelocity.set(250);
        
        smokin(asteroidX,asteroidY);

                
//        textMessage.text = "Key = " + asteroidKey + "  Pos (x,y) = " + asteroidX + ", " +asteroidY + "  Asteroid Count = " + asteroidsGroup.countLiving();
    }
    
    else if(asteroidKey == "asteroidMedium") {
        asteroidsGroup.enableBody = true;

        var ast1;
        var ast2;
//        textMessage.text = "Key = " + asteroidKey + "  Pos (x,y) = " + asteroidX + ", " +asteroidY + "  Asteroid Count = " + asteroidsGroup.countLiving();
        ast1 = game.add.sprite(asteroidX,asteroidY, 'astMediumL');
        asteroidsGroup.add(ast1);
        ast2 = game.add.sprite(asteroidX,asteroidY, 'astMediumR');
        asteroidsGroup.add(ast2);

        ast1.anchor.set(0.5);
        ast1.body.bounce.set(1.2);
        ast1.body.velocity.setTo( game.rnd.realInRange(-2,2) * 30, game.rnd.realInRange(-4,0) * 30);
        ast1.body.maxVelocity.set(250);

        ast2.anchor.set(0.5);
        ast2.body.bounce.set(1.2);
        ast2.body.velocity.setTo(50 + game.rnd.realInRange(-2,2) * 20, 50 + game.rnd.realInRange(0,4) * 20);
        ast2.body.maxVelocity.set(250);
        
        smokin(asteroidX,asteroidY);
                
//        textMessage.text = "Key = " + asteroidKey + "  Pos (x,y) = " + asteroidX + ", " +asteroidY + "  Asteroid Count = " + asteroidsGroup.countLiving();
    }    
    
    else {
    asteroidBoom(asteroidX,asteroidY);
    }
    
    if(asteroidsGroup.countLiving() == 0) {
        level +=1;
        maxAsteroids += 1;
        restart();
    }   
}

function collisionByAsteroid (ship, asteroid) {

    if(shield > 0) {
    }
    else {

        var x = ship.position.x - 150;
        var y = ship.position.y - 200; 

        blowUp(x,y);
        ship.destroy();
        
        lives -= 1;
        livesText.text = livesString + lives;
        if (lives >= 1 ) {
            createShip();
        }
        else {
            endGame();    
        }
        
    }
}

function blowUp(x,y) {
    explosion = game.add.sprite(x,y,'explosion');
    explosion.animations.add('boom');
    explosion.animations.play('boom',24, false);
    
}

function smokin(x,y) {
    var smoke;
    smoke = game.add.sprite(x - 45,y - 45,'asteroidSmoke');
    smoke.animations.add('puff');
    smoke.animations.play('puff',20, false);  
}

function asteroidBoom(x,y) {
    var asteroidBang;
    asteroidBang = game.add.sprite(x - 45,y - 45,'asteroidBoom');
    asteroidBang.animations.add('bang');
    asteroidBang.animations.play('bang',40,false);
}

function screenWrap (starship) {

    if (starship.x < 0)
    {
        starship.x = game.width;
    }
    else if (starship.x > game.width)
    {
        starship.x = 0;
    }

    if (starship.y < 150)
    {
        starship.y = game.height;
    }
    else if (starship.y > game.height)
    {
        starship.y = 150;
    }
}

function restart() {

    //  A new level starts
    if(maxAsteroids > 15) {
        maxAsteroids = 15;   
    }
    
    createAsteroids();
    shield = 300;
    game.world.bringToTop(header);

}

function endGame() {
    stateMessage = game.add.text(game.world.centerX,game.world.centerY,' ', { font: "84px Arial", fill: "#ffff00", align: "center" });
    stateMessage.anchor.setTo(0.5,0.5);
    stateMessage.visible = false;
    
    stateMessage.text = " GAME OVER!";
    stateMessage.visible = true;
    
}

function extraLives() {
    if (score > livesNext) {
        lives += 1;
        livesNext = livesNext * 2;
        livesText.text = livesString + lives;

    }
    
}
