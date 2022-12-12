
BasicGame.MainMenu = function (game) {
    this.startButton;
    this.instruction;

    
    
};

BasicGame.MainMenu.prototype = {

	create: function () {

        console.log("Creating menu state!");
        this.music = this.add.audio('gameplay');
        this.music.loop = true;
        this.music.play();
        
		this.background = this.add.sprite(0, 0, 'preloaderBackground');     
        this.startButton = this.add.button(535, 600, 'startButton', this.startGame, this, 0, 1, 2);
        instText = { font: "18px Arial", fill: "#ffffff" , align: "center" };
        this.instruction = this.add.text(360, 700, "Use cursor keys left and right to change direction and up for thrust. \nSpacebar for the fire button.",instText);
		// Add some buttons
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	resize: function (width, height) {

		//	If the game container is resized this function will be called automatically.
		//	You can use it to align sprites that should be fixed in place and other responsive display things.

	},
    
    startGame: function() {
                this.state.start('Game');        
    },

};
