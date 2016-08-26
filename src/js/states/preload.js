'use strict';

function Preload() {
	this.asset = null;
	this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.game.service.init();
		
		this.asset = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.load.image('math-maze-logo', 'assets/math-maze-logo.png');
		//this.load.image('pointer', 'assets/pointer.png');
		this.load.image('btn', 'assets/btn.png');
		
		/*for (var i = 0; i < 10; i++)
		{
			this.load.image('tile-' + i, 'assets/tile-' + i + '.png');
		}*/
		
		//this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	},
	create: function() {
		this.asset.cropEnabled = false;
	},
	update: function() {
		if (!!this.ready) {
			this.game.state.start('intro');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
};

module.exports = Preload;
