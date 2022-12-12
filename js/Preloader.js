
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar

//		this.background = this.add.tileSprite(0, 0, 1920, 1080, 'preloaderBackground');
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(400, 700, 'preloaderBar');
		
  		this.backgroundColor = 0xffffff;

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.

		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	You can find all of these assets in the Phaser Examples repository

	    // e.g. this.load.image('image-name', 'assets/sprites/sprite.png');
        
        //sounds
        this.load.audio('gameplay','assets/sounds/gameplay.wav');
        this.load.audio('shipExplode','assets/sounds/shipexplode.wav');
        this.load.audio('weaponFire','assets/sounds/weaponfire.wav');
        this.load.audio('asteroidExplosion','assets/sounds/asteroidexplosion.wav');
        this.load.audio('miniExplode','assets/sounds/miniexplode.wav');
        this.load.audio('powerUpCollect','assets/sounds/powerupcollect.wav');

        //Main screen with menu bar and shield icon
        this.load.image('upperConsole','assets/upper_console.png');
        this.load.image('shieldassets', 'assets/shield.png');
        this.load.image('space', 'assets/starscape.jpg');
        this.load.spritesheet('startButton','assets/start_button.png',193,71);
        this.load.spritesheet('menuButton', 'assets/back_to_menu.png',200,71);
          
        this.load.image('ship', 'assets/starship.png');

        //Asteroid Large in its 7 states
        this.load.image('asteroidLarge', 'assets/asteroidLarge.png');
        this.load.image('astLargeLeft', 'assets/asteroidLarge1.png');
        this.load.image('astLargeRight', 'assets/asteroidLarge2.png');
        this.load.image('astLargeTL', 'assets/asteroidLargeTL.png');
        this.load.image('astLargeBL', 'assets/asteroidLargeBL.png');
        this.load.image('astLargeTR', 'assets/asteroidLargeTR.png');
        this.load.image('astLargeBR', 'assets/asteroidLargeBR.png');

        //Asteroid Medium in its 3 states
        this.load.image('asteroidMedium', 'assets/asteroidMedium.png');
        this.load.image('astMediumL', 'assets/asteroidMediumL.png');
        this.load.image('astMediumR', 'assets/asteroidMediumR.png');

        //Asteroid Small
        this.load.image('asteroidSmall', 'assets/asteroidSmall.png');
        
        //Asteroid Super
        this.load.image('superAsteroid', 'assets/asteroidSuper.png');

        //Weapons
        this.load.image('bullet', 'assets/bullets.png');
        
        //Spritesheets
        this.load.spritesheet ('explosion', 'assets/explo.png', 256, 256, 48);
        this.load.spritesheet ('asteroidBoom', 'assets/asteroid_explosion.png', 128, 128, 40);
        this.load.spritesheet ('asteroidSmoke', 'assets/smoke.png', 128, 128, 40);


        this.load.image('powerUp', 'assets/power-up2.png');
          
	},

	create: function () {

        console.log("Creating preload state!");

		this.state.start('MainMenu');

	}

};
