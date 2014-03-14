var Game = {
	TEXT_HEIGHT: 3,
	STATUS_HEIGHT: 3,
	MAP_SIZE: new XY(100, 30),
	GOLD: [255, 220, 120],
	FISH: "",

	scheduler: null,
	player: null,
	level: null,
	display: null,
	text: null,
	status: null,

	engine: null,
	
	init: function() {
		window.addEventListener("load", this);
		var xhr = new XMLHttpRequest();
		xhr.open("get", "fish.txt", true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) { Game.FISH = xhr.responseText; }
		}
		xhr.send();
	},

	handleEvent: function(e) {
		switch (e.type) {
			case "keypress":
				window.removeEventListener(e.type, this);
				document.body.innerHTML = "";

				this.player = new Player();

				var options = {
					width: this.MAP_SIZE.x,
					height: this.TEXT_HEIGHT + this.STATUS_HEIGHT + this.MAP_SIZE.y,
					fontFamily: "droid sans mono, monospace",
					spacing: 1.1,
					fg: "#aaa"
				}
				this.display = new ROT.Display(options);
				this.status = new Status(this.display);

				this.text = new TextBuffer(this.display);
				this.text.configure({
					display: this.display,
					position: new XY(0, 0),
					size: new XY(this.MAP_SIZE.x, this.TEXT_HEIGHT)
				});
				this.text.clear();

				document.body.appendChild(this.display.getContainer());
				window.addEventListener("resize", this);
				this._resize();

				this._help();
			break;

			case "resize":
				this._resize();
			break;
			
			case "load":
				window.removeEventListener("load", this);
				this._intro();
			break;
		}
	},

	over: function() {
		this.engine.lock();
		this.text.write("You die... %c{#666}(reload the page to start a new game)");
		this.text.flush();
	},

	switchLevel: function(level, xy) {
		if (this.level) { this.level.deactivate(); }
		this.level = level;
		this.level.activate();
		this.level.setBeing(this.player, xy);
	},

	_intro: function() {
		window.addEventListener("keypress", this);
	},

	_help: function() {
		var help = new Help(true);
		help.show().then(this._start.bind(this));
	},
	
	_resize: function() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		var fontSize = this.display.computeFontSize(w, h);
		this.display.setOptions({fontSize:fontSize});
		
		var node = this.display.getContainer();
		node.style.left = Math.round((w-node.offsetWidth)/2) + "px";
		node.style.top = Math.round((h-node.offsetHeight)/2) + "px";
	},
	
	_start: function() {
		this.scheduler = new ROT.Scheduler.Speed();
		this.engine = new ROT.Engine(this.scheduler);

		/* build a level and position a player */
		var overview = new Level.Overview();
		this.switchLevel(overview, overview.getCenter());
		this.engine.start();
	}
}

Game.init();
