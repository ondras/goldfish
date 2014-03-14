Being.Fisher = function(color, delta) {
	Being.call(this, {fg:color, ch:"F", description:"fisherman"});

	this._delta = delta;
	this._rods = [];
	this._shrinking = false;
	this._item = null;
	this._rodChar = "";
	this._finished = false;
	
	if (delta.x*delta.y == 1) {
		this._rodChar = "\\";
	} else if (delta.x*delta.y == -1) {
		this._rodChar = "/";
	} else if (delta.x) {
		this._rodChar = "−";
	} else {
		this._rodChar = "|";
	}
}
Being.Fisher.extend(Being);

/**
 * Generate item + staircase, bound to dungeon creation callback
 */
Being.Fisher.prototype.generate = function() {
	if (this._item) { return; }

	this._item = new Item.Quest(this._visual.fg);
	var danger = 1 + Math.floor(3 * Progress.questsGenerated / Rules.QUESTS);

	var xy = this._level.pickStaircasePosition(); /* do this before we increase questsGenerated */

	var staircase = new Cell.Staircase(danger);
	staircase.setTarget(function() {
		var level = new Level.Cavern(this._level, xy, this._item, danger);
		staircase.setTarget(level, level.getEntrance());
	}.bind(this));

	this._level.setCell(staircase, xy);
	Progress.questsGenerated++;
}

Being.Fisher.prototype.interact = function(being) {
	var status = being.getQuestStatus(this);
	
	switch (status) {
		case 0: /* first visit */
			if (!this._item) { this.generate(); }
			being.addQuest(this, this._item);
			this._chatGiveQuest();
		break;
		
		case 1: /* quest already received */
			this._chatQuestGiven();
		break;
		
		case 2: /* has item */
			this._finished = true;
			being.setQuestStatus(this, 3);
			this._chatFinishQuest();
		break;
		
		case 3: /* item already given */
			this._chatQuestFinished();
		break;
		
	}
}

Being.Fisher.prototype.act = function() {
	if (!this._rods.length) { /* start showing rod? */
		if (this._finished) { return; } /* finished = inactive */
		if (ROT.RNG.getUniform() < Rules.ROD_SHOW_CHANCE) { this._growRod(); }
		return;
	}
	
	if (this._rods.length == Rules.ROD_LENGTH) { /* start hiding rod? */
		if (ROT.RNG.getUniform() < Rules.ROD_HIDE_CHANCE) { this._shrinkRod(); }
		return;
	}
	
	if (this._shrinking) { this._shrinkRod(); } else { this._growRod(); }
}

Being.Fisher.prototype._growRod = function() {
	this._shrinking = false;

	if (this._rods.length) {
		var xy = this._getRodPosition(this._rods.length-1);
		this._rods[this._rods.length-1].setLast(false);
		this._level.draw(xy);
	}

	var rod = new Cell.Rod(this, {fg:this._visual.fg, ch:this._rodChar});
	rod.setLast(true);
	this._rods.push(rod);

	var xy = this._getRodPosition(this._rods.length-1);
	this._level.setCell(rod, xy);

	/* we might have caught a fish */
	var being = this._level.getBeingAt(xy);
	if (being == Game.player) { this.interact(being); }
}

Being.Fisher.prototype._shrinkRod = function() {
	this._shrinking = true;
	
	var xy = this._getRodPosition(this._rods.length-1);
	var last = this._rods.pop();
	this._level.setCell(null, xy);

	if (this._rods.length) {
		var xy = this._getRodPosition(this._rods.length-1);
		this._rods[this._rods.length-1].setLast(true);
		this._level.draw(xy);

		/* we might have caught a fish */
		var being = this._level.getBeingAt(xy);
		if (being == Game.player) { this.interact(being); }
	}
}

Being.Fisher.prototype._getRodPosition = function(index) {
	var length = index+1;
	var delta = new XY(this._delta.x*length, this._delta.y*length);
	return this._xy.plus(delta);
}

Being.Fisher.prototype._chat = function(parts) {
	Game.engine.lock();

	var throwPlayer = function() {
		var dist = Rules.ROD_LENGTH + 3;
		var xy = this._xy.plus(new XY(this._delta.x * dist, this._delta.y * dist));
		this._level.setBeing(Game.player, xy);
	}.bind(this);
	
	var showPart = function(part, enter) {
		Game.text.clear();
		
		var str = part.text;
		if (part.who == "f") {
			str = "The fisherman: \"" + str + "\"";
		} else if (part.who == "y") {
			str = "You: \"" + str + "\"";
		}
		
		Game.text.write(str);
		if (enter) { Game.text.write("%c{#666}(press Enter to continue)"); }

		Game.text.flush();
	}
	
	var handler = function(e) {
		if (e.keyCode != 13) { return; }
		showPart(parts.shift(), parts.length);
		if (!parts.length) {
			throwPlayer();
			window.removeEventListener("keydown", handler, false);
			Game.engine.unlock();
		}
	}

	window.addEventListener("keydown", handler, false);
	showPart(parts.shift(), parts.length);
}

Being.Fisher.prototype._chatGiveQuest = function() {
	var parts = [
		{
			text: [
				"Wow, a goldfish! This is going to be a fine meal.",
				"Look what I caught! A goldfish. Looks rather small...",
				"Well, well, well. What do we have here. A goldfish?"
			].random(),
			who: "f"
		},
		{
			text: "Let me go, pleasepleaseplease! I will ... grant you a wish!",
			who: "y"
		},
		{
			text: "A wish, you say? Well then. I wish for ... %c{#fff}" + this._item + "%c{}. Bring it to me as fast as possible!",
			who: "f"
		},
		{
			text: "The fisherman throws you back into the water.",
			who: ""
		}
	];
	this._chat(parts);
};

Being.Fisher.prototype._chatQuestGiven = function() {
	var parts = [
		{
			text: "I am still waiting for %c{#fff}" + this._item + "%c{} I wished for.",
			who: "f"
		},
		{
			text: "The fisherman throws you back into the water.",
			who: ""
		}
	];
	this._chat(parts);
};

Being.Fisher.prototype._chatFinishQuest = function() {
	var parts = [
		{
			text: "Wow! %c{#fff}" + this._item.toString().capitalize() + "%c{}! Thank your very much!",
			who: "f"
		},
		{
			text: "Now that my wish has been fulfilled, I will gladly let you go.",
			who: "f"
		},
		{
			text: "The fisherman smiles happily and throws you back into the water.",
			who: ""
		}
	];
	
	Progress.questsFinished++;
	if (Progress.questsFinished == Rules.QUESTS) { /* Victory! */
		parts.push({
			who: "",
			text: "%c{#fff}Congratulations!%c{} You managed to fulfill all wishes and successfully finish this game. "+
				 "You are officially the best goldfish ever."
		});
		
		parts.push({
			who: "",
			text: "(By the way, you spent %c{#fff}" + Progress.turns + "%c{} game turns; " + 
				"reload the page to improve your score in another try!)"
		});
		Game.engine.lock();
	}
	
	this._chat(parts);
};

Being.Fisher.prototype._chatQuestFinished = function() {
	var parts = [
		{
			text: "I recognize you! You are the goldfish that brought me %c{#fff}" + this._item + "%c{}.",
			who: "f"
		},
		{
			text: "The fisherman smiles happily and throws you back into the water.",
			who: ""
		}
	];
	this._chat(parts);
};
