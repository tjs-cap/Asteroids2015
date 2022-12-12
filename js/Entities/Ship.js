Ship = function(_game, _x, _y)

{
  console.log("Creating Player's Ship!");

  this.game = _game;
  Phaser.Sprite.call(this, this.game, _x, _y, 'ship');
  this.game.add.existing(this);
  this.game.physics.arcade.enable(this);
  this.anchor.setTo(0.5);
  this.body.drag.set(100);
  this.body.maxVelocity.set(200);  
  this.body.bounce.set(0.1);


  //Animation

//  this.animations.add('run',[0,1,2],10,true);

//  this.animations.add('stand',[6]);

//  this.animations.add('skid',[3]);

//  this.animations.add('jump',[4]);

//  this.animations.add('die',[5]);

  return this;
};

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;
