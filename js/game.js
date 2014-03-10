var Game = {
	TEXT_HEIGHT: 3,
	STATUS_HEIGHT: 3,
	MAP_SIZE: new XY(90, 30),

	scheduler: null,
	player: null,
	level: null,
	display: null,
	text: null,
	status: null,
	turns: -1,

	_engine: null,
	
	init: function() {
		window.addEventListener("load", this);
	},

	handleEvent: function(e) {
		switch (e.type) {
			case "resize":
				this._resize();
			break;
			
			case "load":
				window.removeEventListener("load", this);

				this.scheduler = new ROT.Scheduler.Speed();
				this._engine = new ROT.Engine(this.scheduler);
				
				var options = {
					width: this.MAP_SIZE.x,
					height: this.TEXT_HEIGHT + this.STATUS_HEIGHT + this.MAP_SIZE.y,
					fontFamily: "droid sans mono",
					fg: "#999"
				}
				this.display = new ROT.Display(options);

				this.status = new Status(this.display);

				this.text = new TextBuffer(this.display);
				this.text.configure({
					display: this.display,
					position: new XY(0, 0),
					size: new XY(this.MAP_SIZE.x, this.TEXT_HEIGHT-1)
				});
				this.text.clear();

				document.body.appendChild(this.display.getContainer());
				window.addEventListener("resize", this);
				this._resize();

				this.player = new Player();

				/* FIXME build a level and position a player */
				var level = new Level.Cavern();
				var size = level.getSize();
				this._switchLevel(level, level.getEntrance());

				this._engine.start();
			break;
		}
	},

	over: function() {
		this._engine.lock();
		/* FIXME show something */
	},

	_switchLevel: function(level, xy) {
		if (this.level) { this.level.deactivate(); }
		this.level = level;
		this.level.activate();
		this.level.setBeing(this.player, xy);
	},
	
	_resize: function() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		var fontSize = this.display.computeFontSize(w, h);
		this.display.setOptions({fontSize:fontSize});
		
		var node = this.display.getContainer();
		node.style.left = Math.round((w-node.offsetWidth)/2) + "px";
		node.style.top = Math.round((h-node.offsetHeight)/2) + "px";
	}
}

Game.init();
