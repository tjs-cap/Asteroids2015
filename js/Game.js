BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
    
    this.cursors;

    this.shield = 0;
    this.shieldCounter = 0;

    this.lives = 3;
    this.livesNext = 1000;
    this.score = 0;

    this.asteroidsGroup;
    this.noOfAsteroids;
    this.maxAsteroids = 1;
    this.liveAsteroids;
    this.asteroidBang;
    this.smoke;

    
    this.bulletTime = 0;
    this.bullets;
    this.bulletsLevel = 1;
    this.level = 1;
    this.bulletRange = 1000;
    
    this.miningLaser;

//    this.enemy;
//    this.enemyCounter = game.rnd.realInRange(10000,30000);
    
    this.superAsteroidGroup;
    this.asteroidSuper;
    this.asteroidCounterMax = Math.round(game.rnd.realInRange(2000,8000));
    this.asteroidCounter = 0;
    this.hitsSuperAsteroid = 30;
    
    this.powerUpGroup;
    this.powerUpText = "";
    this.textTime = 0;
    
    this.menuButton;
    
    
    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

	create: function () {

        console.log("Creating game state!");

        //add main background for the game
        this.add.sprite(0, 0, 'space');

        //  Our ships bullets
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletTime = 0;

        //  All of them
        this.bullets.createMultiple(10, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        
        // Add ship
        ship = new Ship (this.game, 600, 400);
        
        //Add asteroid
        this.createAsteroids();       

        //Set up super asteroid group
        this.superAsteroidGroup = this.add.group();
        this.superAsteroidGroup.enableBody = true;

        //Set up Power Ups
        this.powerUpGroup = this.add.group();
        this.powerUpGroup.enableBody = true;

        
        //set controls
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
        //set up and implement group with all screen assets
        header = this.add.group();
        header.add(this.add.sprite(0, 0, 'upperConsole'));
            
        //adding text
        //left side ( -- SCORE --)
        this.score = 0;
        scoreString = "Score:  ";
        style = { font: "32px Arial Black", fill: "#ffff00" , align: "left" };
        header.add(scoreText= this.add.text(50,17, scoreString + this.score, style));

        //right side ( -- LIVES --)
        lives = 3;
        livesString = "Lives:  ";
        header.add(livesText = this.add.text(935,17, livesString + this.lives, style));

        //top right (-- SHIELD COUNTER --)
        this.shield = 300;
        header.add(this.add.sprite(1150,5, 'shieldassets'));
        styleShield = { font: "90px Arial Black", fill: "#ffff00" , align: "left" };
        header.add(shieldText = this.add.text(1195, 15, this.shield/100, styleShield));

        //bottom left (-- Dev Message --)
        textStyle = { font: "20px Arial", fill: "#ffff00" , align: "left" };
        header.add(textMessage = this.add.text(30, 700, " ", textStyle));

        
        //Set banner and text to the front
        this.world.bringToTop (header); 
        
	},

	update: function () {

    this.liveAsteroids = this.asteroidsGroup.countLiving();
    if(this.superAsteroidGroup.countLiving() == 1){
        this.asteroidCounter = 0;
    }
    
    this.textTime += 1;
    textMessage.text = this.powerUpText;
        if(this.textTime > 200)
        {
            this.powerUpText = "";
        }

        
//    textMessage.text = "AsteroidCounter =  " + this.asteroidCounter + "\nAsteroidCounterMax = " + this.asteroidCounterMax + "\nNumber of asteroids = " + this.liveAsteroids;

    this.asteroidCounter += 1;
    this.asteroidCounterCheck();
    
    this.extraLives();
    this.shield -= 1;
    if(this.shield < 0) {this.shield = 0;}
    shieldText.text = Math.round(this.shield/100).toString();
    
    //Asteroid collisions
    this.physics.arcade.collide(this.bullets, this.asteroidsGroup, this.collisionBulletvAsteroid, null, this);
    this.physics.arcade.collide(ship, this.asteroidsGroup, this.collisionByAsteroid, null, this);
    this.physics.arcade.collide(this.asteroidsGroup, this.asteroidsGroup);
    
    //Super Asteroid collisions
    this.physics.arcade.collide(ship, this.superAsteroidGroup, this.collisionByAsteroid, null,this);
    this.physics.arcade.collide(this.bullets, this.superAsteroidGroup, this.collisionBulletvSuperAsteroid, null, this);
//    this.physics.arcade.collide(this.asteroidsGroup, this.superAsteroidGroup, this.collisionAsteroidvSuperAsteroid, null, this);
    this.physics.arcade.collide(this.asteroidsGroup, this.superAsteroidGroup);
    

    //PowerUp collisions
    this.physics.arcade.collide(this.powerUpGroup, this.asteroidsGroup);
    this.physics.arcade.collide(ship, this.powerUpGroup, this.powerUpCollect, null, this);
    this.physics.arcade.collide(this.bullets, this.powerUpGroup, this.collisionBulletvAsteroid, null, this);
    
    if(this.lives > 0) {
        if (cursors.up.isDown)
            {
                this.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
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

         if (fireButton.isDown)
            {
                this.fireBullet();
            }
    }
        
    this.world.bringToTop (header);

    //Controlling the screen-wrap within the game
    this.screenWrap (ship);
    this.superAsteroidGroup.forEachExists (this.screenWrap, this.superAsteroidGroup);    
    this.asteroidsGroup.forEachExists (this.screenWrap, this.asteroidsGroup);    
    this.bullets.forEachExists (this.screenWrap, this.bullets); 
    this.powerUpGroup.forEachExists (this.screenWrap, this.powerUpGroup);
    
    },      
   
powerUpCollect: function (ship, powerUp) {
    console.log("Power-Up performed");
    bulletSound = this.add.audio('powerUpCollect');
    bulletSound.play();
    powerUp.destroy();
    result = Math.round(this.game.rnd.realInRange(1,15));
    if(result < 3) {
    console.log("Power-Up performed - Shield +5");
        this.textTime = 0;
        this.shield += 500;
        this.powerUpText = "Extra Shields";
    } else if (result < 5) {
    console.log("Power-Up performed - Extend Range of bullet");
        this.textTime = 0;
        this.bulletRange += 250 ;
        this.powerUpText = "Weapons Range Extended";
        if(this.bulletRange > 2000) {
            this.bulletRange = 2000;
            this.powerUpText = "Weapons Max Range";
        }
    } else if (result < 7) {
    console.log("Power-Up performed - Points +100");
        this.textTime = 0;
        this.lives += 1;
        this.shield += 100;
        this.powerUpText = "Extra Life";
        livesText.text = livesString + this.lives;

    } else {
    console.log("Power-Up performed - Points +100 - 1000, Shield +1 - 10");
        this.textTime = 0;
        var multiplier = Math.round(this.game.rnd.realInRange(1,10));
        this.shield += multiplier * 50;
        this.score += multiplier * 100;
        this.powerUpText = multiplier * 100 + " Bonus Points" ;
        scoreText.text = scoreString + this.score;
        
    }
            
},    
    
collisionAsteroidvSuperAsteroid: function (asteroid, superAsteroid) {
    var asteroidKey = asteroid.key.toString();
    var asteroidX = asteroid.position.x;
    var asteroidY = asteroid.position.y;

    asteroid.destroy();
    this.checkAsteroidType(asteroidKey,asteroidX,asteroidY);

    if(this.asteroidsGroup.countLiving() == 0) {
    this.level +=1;
    this.maxAsteroids += 1;
    this.restart();
    }
},
    
collisionBulletvAsteroid: function (bullet, asteroid) {

    //get asteroid.kill type and position
    var asteroidKey = asteroid.key.toString();
    var asteroidX = asteroid.position.x;
    var asteroidY = asteroid.position.y;
    
    //  When a bullet hits an asteroid we kill them both
    bullet.kill();
    asteroid.destroy();
    
    this.score += 20;
    scoreText.text = scoreString + this.score;
    this.checkAsteroidType(asteroidKey,asteroidX,asteroidY);

    //Check for power up
    var powerUpVar = this.rnd.realInRange(1,1000);
    if (powerUpVar < 100) {
        this.powerUp(asteroidX, asteroidY);  
    }
    
    if(this.asteroidsGroup.countLiving() == 0) {
        this.level +=1;
        this.maxAsteroids += 1;
        this.restart();
    }   
},
    
    collisionBulletvSuperAsteroid: function (bullet, asteroid) {

    //get asteroid.kill type and position
    var x = bullet.position.x;
    var y = bullet.position.y;
    
    //  When a bullet hits an asteroid we kill them both
    bullet.kill();
    this.smokin(x,y);
    this.hitsSuperAsteroid -= 1;
    
    if(this.hitsSuperAsteroid == 0) {
        asteroid.destroy();
        this.blowUp(x,y);
        this.score +=1000;
        this.hitsSuperAsteroid = 30;
        
        scoreText.text = scoreString + this.score;
        for(i=0; i<4; i++) {
            this.powerUp(x,y);
            
        }

    }    
      
},

    //check which asteroid is being destroyed. Each has a different outcome!
    checkAsteroidType: function (asteroidKey,asteroidX,asteroidY) {
            
        if(asteroidKey == "asteroidLarge") {
        this.asteroidsGroup.enableBody = true;
        var ast1;
        var ast2;
        ast1 = this.game.add.sprite(asteroidX,asteroidY, 'astLargeLeft');
        this.asteroidsGroup.add(ast1);
        ast2 = this.game.add.sprite(asteroidX + 50,asteroidY, 'astLargeRight');
        this.asteroidsGroup.add(ast2);
        ast1.anchor.set(0.5);
        ast1.body.bounce.set(1.2);
        ast1.body.velocity.setTo(-50 + this.game.rnd.realInRange(-3,0) * 20, 50 + this.game.rnd.realInRange(-2,2) * 20);
        ast1.body.maxVelocity.set(250);
        ast2.anchor.set(0.5);
        ast2.body.bounce.set(1.2);
        ast2.body.velocity.setTo(50 + this.game.rnd.realInRange(0,3) * 20, 50 + this.game.rnd.realInRange(-2,2) * 20);
        ast2.body.maxVelocity.set(250);
        this.smokin(asteroidX,asteroidY);
    }
    
    else if(asteroidKey == "astLargeLeft") {
        this.asteroidsGroup.enableBody = true;

        var ast1;
        var ast2;

        ast1 = this.game.add.sprite(asteroidX,asteroidY, 'astLargeTL');
        this.asteroidsGroup.add(ast1);
        ast2 = this.game.add.sprite(asteroidX,asteroidY, 'astLargeBL');
        this.asteroidsGroup.add(ast2);

        ast1.anchor.set(0.5);
        ast1.body.bounce.set(1.2);
        ast1.body.velocity.setTo( this.game.rnd.realInRange(-2,2) * 30, this.game.rnd.realInRange(-4,0) * 30);
        ast1.body.maxVelocity.set(250);

        ast2.anchor.set(0.5);
        ast2.body.bounce.set(1.2);
        ast2.body.velocity.setTo(50 + this.game.rnd.realInRange(-2,2) * 20, 50 + this.game.rnd.realInRange(0,4) * 20);
        ast2.body.maxVelocity.set(250);

        this.smokin(asteroidX,asteroidY);
                

    }
    
    else if(asteroidKey == "astLargeRight") {
        this.asteroidsGroup.enableBody = true;

        var ast1;
        var ast2;

        ast1 = this.game.add.sprite(asteroidX,asteroidY, 'astLargeTR');
        this.asteroidsGroup.add(ast1);
        ast2 = this.game.add.sprite(asteroidX,asteroidY, 'astLargeBR');
        this.asteroidsGroup.add(ast2);

        ast1.anchor.set(0.5);
        ast1.body.bounce.set(1.2);
        ast1.body.velocity.setTo( this.game.rnd.realInRange(-2,2) * 30, this.game.rnd.realInRange(-4,0) * 30);
        ast1.body.maxVelocity.set(250);

        ast2.anchor.set(0.5);
        ast2.body.bounce.set(1.2);
        ast2.body.velocity.setTo(50 + this.game.rnd.realInRange(-2,2) * 20, 50 + this.game.rnd.realInRange(0,4) * 20);
        ast2.body.maxVelocity.set(250);
        
        this.smokin(asteroidX,asteroidY);

                

    }
    
    else if(asteroidKey == "asteroidMedium") {
        this.asteroidsGroup.enableBody = true;

        var ast1;
        var ast2;

        ast1 = this.game.add.sprite(asteroidX,asteroidY, 'astMediumL');
        this.asteroidsGroup.add(ast1);
        ast2 = this.game.add.sprite(asteroidX,asteroidY, 'astMediumR');
        this.asteroidsGroup.add(ast2);

        ast1.anchor.set(0.5);
        ast1.body.bounce.set(1.2);
        ast1.body.velocity.setTo( this.game.rnd.realInRange(-2,2) * 30, this.game.rnd.realInRange(-4,0) * 30);
        ast1.body.maxVelocity.set(250);

        ast2.anchor.set(0.5);
        ast2.body.bounce.set(1.2);
        ast2.body.velocity.setTo(50 + this.rnd.realInRange(-2,2) * 20, 50 + this.rnd.realInRange(0,4) * 20);
        ast2.body.maxVelocity.set(250);
        
        this.smokin(asteroidX,asteroidY);
                

    }    
    
    else {
    this.asteroidBoom(asteroidX,asteroidY);
    }
        
    },
    
    extraLives: function () {
        if (this.score > this.livesNext) {
        console.log("Level increase success!");
            this.lives += 1;
            this.livesNext = this.livesNext * 2;
            livesText.text = livesString + this.lives;
        }
    },
    
    asteroidCounterCheck: function () {
        
        if (this.asteroidCounter == this.asteroidCounterMax) {
            var s = this.superAsteroidGroup.create(this.world.randomX, 0, 'superAsteroid');
            s.anchor.set(0.5);
            s.body.bounce.set(0.1);
            var x = this.rnd.realInRange(-1,1);
            if(x < 0){
                x = -1; }
            else {
                x = 1; }
            s.body.velocity.setTo(this.rnd.realInRange(1,3) * 40 * x, this.rnd.realInRange(1,3) * 40 * x);
            s.body.maxVelocity.set(100);

        }
        
    },
    
    createAsteroids: function () {
        this.asteroidsGroup = this.add.group();
        this.asteroidsGroup.enableBody = true;
        this.noOfAsteroids = this.maxAsteroids;

        for (var i = 0; i < this.noOfAsteroids; i++)
        {
            var rand = 0;
            rand = this.rnd.realInRange(1, 100);
            if(rand < 40) {
                var s = this.asteroidsGroup.create(this.world.randomX, 0, 'asteroidLarge');
            }
            else if (rand < 70) {
                var s = this.asteroidsGroup.create(this.world.randomX, 0, 'asteroidMedium');            
            }
            else {
                var s = this.asteroidsGroup.create(this.world.randomX, 0, 'asteroidSmall');            
            }
            s.anchor.set(0.5);
            s.body.bounce.set(1.2);
            var x = this.rnd.realInRange(-1,1);
            if(x < 0){
                x = -1; }
            else {
                x = 1; }
            s.body.velocity.setTo(this.rnd.realInRange(1,3) * 40 * x, this.rnd.realInRange(1,3) * 40 * x);
            s.body.maxVelocity.set(200);
        }
    },
    
    
    fireBullet: function () {
        
    bulletSound = this.add.audio('weaponFire');
    if (this.game.time.now > this.bulletTime)
        {
            bullet = this.bullets.getFirstExists(false);
                if (bullet)
                {
                    bullet.rotation = ship.rotation;
                    bullet.reset(ship.body.x + 40 , ship.body.y + 31);
                    bullet.lifespan = this.bulletRange;
                    this.game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity);
                    this.bulletTime = this.game.time.now + 200;
                    bulletSound.play();
            }
        }
    },

    
    screenWrap: function (starship) {

        if (starship.x < 0)
        {
            starship.x = 1240;
        }
        else if (starship.x > 1240)
        {
            starship.x = 0;
        }

        if (starship.y < 150)
        {
            starship.y = 800;
        }
        else if (starship.y > 800)
        {
            starship.y = 150;
        }
    },
  
    endGame: function () {
    ship.destroy();
    stateMessage = this.add.text(630,400,' ', { font: "84px Arial", fill: "#ffff00", align: "center" });
    stateMessage.anchor.setTo(0.5,0.5);
//    stateMessage.visible = false;
    stateMessage.text = " GAME OVER!";
    this.menuButton = this.add.button(550, 450, 'menuButton', this.quitGame, this, 0, 1, 2);

//    stateMessage.visible = true;

    },
    
    collisionByAsteroid: function (ship, asteroid) {

    if(this.shield > 0) {
    }
    else {

        var x = ship.position.x - 150;
        var y = ship.position.y - 200; 

        ship.visibility = false;
        this.blowUp(x,y);
        
        this.lives -= 1;
        livesText.text = livesString + this.lives;
        
        if (this.lives >= 1 ) {
        ship.position.x = 600;
        ship.position.y = 400; 
        this.shield = 200;
        this.bulletRange = 1000;
        }
        
        else {
            this.endGame();    
        }       
    }
},

//ship explosion     
blowUp: function (x,y) {
    explosion = this.add.sprite(x,y,'explosion');
    explosionSound = this.add.audio('shipExplode');
    explosionSound.play();
    explosion.animations.add('boom');
    explosion.animations.play('boom',24, false);
    explosion.animations.killOnComplete = true;
},

//Splitting an asteroid, the cloud created
smokin: function (x,y) {
    this.smoke = this.add.sprite(x - 45,y - 45,'asteroidSmoke');
    miniExplSound = this.add.audio('miniExplode');
    miniExplSound.play();
    this.smoke.animations.add('puff');
    this.smoke.animations.play('puff',20, false);  
    this.smoke.killOnComplete = true;
},

//Asteroid full explosion
asteroidBoom: function (x,y) {
    this.asteroidBang = this.add.sprite(x - 45,y - 45,'asteroidBoom');
    asteroidExplosion = this.add.audio('asteroidExplosion');
    asteroidExplosion.play();
    this.asteroidBang.animations.add('bang');
    this.asteroidBang.animations.play('bang',40,false);
    this.asteroidBang.killOnComplete = true;
},
    
//Manage power ups including position on board and length of time active
powerUp: function (x,y) {
        this.powerUpGroup.enableBody = true;
        var pus;
        pus = this.game.add.sprite(x,y, 'powerUp');
        this.powerUpGroup.add(pus);

        pus.lifespan = 10000;
        pus.anchor.set(0.5);
        pus.body.bounce.set(1.2);
        pus.body.velocity.setTo( this.game.rnd.realInRange(-2,2) * 30, this.game.rnd.realInRange(-4,0) * 30);
        pus.body.maxVelocity.set(250);
},   

restart: function () {

    //  A new level starts
    if(this.maxAsteroids > 8) {
        this.maxAsteroids = 8;   
    }

    
    this.shield += 100;
    this.createAsteroids();
    this.world.bringToTop(header);

},
    
        
	quitGame: function (pointer){
        this.bulletTime = 0;
        this.bulletsLevel = 1;
        this.level = 1;
        this.shield = 0;
        this.shieldCounter = 0;

        this.lives = 3;
        this.livesNext = 1000;
        this.score = 0;
        
        this.noOfAsteroids;
        this.maxAsteroids = 1;



		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');
        
	}   

};


