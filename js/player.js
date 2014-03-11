var Player = function() {
	Being.call(this, {ch:"@", fg:Game.GOLD});
	
	this._stats.hp = 15;
	this._stats.maxhp = 20;
	
	this._stats.o2 = 10;
	this._stats.maxo2 = 20;
	this._submerged = 0;

	this._promise = null;
	this._items = [];
	this._slots = [];
	
	this._keys = {};
	this._keys[ROT.VK_K] = 0;
	this._keys[ROT.VK_UP] = 0;
	this._keys[ROT.VK_NUMPAD8] = 0;
	this._keys[ROT.VK_U] = 1;
	this._keys[ROT.VK_NUMPAD9] = 1;
	this._keys[ROT.VK_L] = 2;
	this._keys[ROT.VK_RIGHT] = 2;
	this._keys[ROT.VK_NUMPAD6] = 2;
	this._keys[ROT.VK_N] = 3;
	this._keys[ROT.VK_NUMPAD3] = 3;
	this._keys[ROT.VK_J] = 4;
	this._keys[ROT.VK_DOWN] = 4;
	this._keys[ROT.VK_NUMPAD2] = 4;
	this._keys[ROT.VK_B] = 5;
	this._keys[ROT.VK_NUMPAD1] = 5;
	this._keys[ROT.VK_H] = 6;
	this._keys[ROT.VK_LEFT] = 6;
	this._keys[ROT.VK_NUMPAD4] = 6;
	this._keys[ROT.VK_Y] = 7;
	this._keys[ROT.VK_NUMPAD7] = 7;

	this._initSlots();
}
Player.extend(Being);

Player.prototype.getItems = function() {
	return this._items;
}

Player.prototype.getSlots = function() {
	return this._slots;
}

Player.prototype.setStat = function(name, value) {
	Being.prototype.setStat.call(this, name, value);
	Game.status.update();
}

Player.prototype.getStat = function(name) {
	var value = Being.prototype.getStat.call(this, name);
	this._slots.forEach(function(slot) {
		var item = slot.getItem();
		if (item.getStatName() == name) { value += item.getStatValue(); }
	});
	return value;
}

Player.prototype.setPosition = function(xy, level) {
	if (level instanceof Level.Overview) {
		this._submerged = 0;
		this.setStat("o2", this.getStat("maxo2"));
	} else if (level instanceof Level.Cavern) {
		this._submerged++;
		if (this._submerged >= Rules.SUBMERGED) { this._useO2(); }
	}

	Being.prototype.setPosition.call(this, xy, level);
}

Player.prototype.act = function() {
	Game.turns++;
	Game.status.updatePart("turns");
	this._promise = new Promise();
	
	this._listen();
	
	return this._promise;
}

Player.prototype.die = function() {
	Being.prototype.die.call(this);
	Game.over();
}

Player.prototype.handleEvent = function(e) {
	if (e.ctrlKey || e.altKey) { return; }

	window.removeEventListener("keydown", this);
	Game.text.clear();
	var code = e.keyCode;

	if (code in this._keys) {
		var direction = this._keys[code];
		var dir = ROT.DIRS[8][direction];
		var xy = this._xy.plus(new XY(dir[0], dir[1]));
		var being = this._level.getBeingAt(xy);
		if (being) { /* attack */
			this._attack(being);
		} else if (this._level.blocks(xy)) { /* collision, noop */
			var d = this._level.getCellAt(xy).getVisual().description;
			if (d) { Game.text.write("You bump into %a.".format(this._level.getCellAt(xy))); }
			return this._listen();
		} else { /* movement */
			this._level.setBeing(this, xy);
		}

		return this._promise.fulfill();
	}

	switch (e.keyCode) {
		case ROT.VK_I:
			var inventory = new Inventory(this);
			inventory.show().then(function() {
				Game.display.clear(); /* clear all */
				Game.status.update(); /* draw status */
				this._level.drawMemory();
				this._level.setBeing(this, this._xy);
				this._listen();
			}.bind(this));
		break;

		case ROT.VK_Q:
			/* FIXME quests */
		break;
		
		case ROT.VK_QUESTION_MARK: 
			/* FIXME help */
		break;
		
		case ROT.VK_RETURN:
			var item = this._level.getItemAt(this._xy);
			var cell = this._level.getCellAt(this._xy);
			if (item) {
				this._pick(item);
				this._promise.fulfill();
			} else if (cell.activate) {
				Game.text.clear();
				cell.activate(this);
				this._promise.fulfill();
			}
		break;
		
		default: /* unrecognized key */
			Game.text.write("(an unknown key was pressed)");
			this._listen();
		break;
	}
	
}

Player.prototype.computeFOV = function() {
	var result = {};
	
	var level = this._level;
	var fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
		return !level.blocks(new XY(x, y));
	});
	fov.compute(this._xy.x, this._xy.y, this.getStat("sight"), function(x, y, r, amount) {
		var xy = new XY(x, y);
		result[xy] = xy;
	});
	
	return result;
}

Player.prototype._listen = function(e) {
	this._describe();
	window.addEventListener("keydown", this);
}

Player.prototype._attack = function(being) {
	/* FIXME */
}

Player.prototype._useO2 = function() {
	var current = this.getStat("o2");
	if (current) {
		this.adjustStat("o2", -1)
		this._submerged = 0;
	} else if (ROT.RNG.getUniform() > Rules.SUFFOCATE_CHANCE) {
		/* FIXME text */
		this.damage(1);
	}
}

Player.prototype._describe = function() {
	var cell = this._level.getCellAt(this._xy);
	
	if (cell.getVisual().description) {
		Game.text.write("You see %a.".format(cell));
	}
	
	var item = this._level.getItemAt(this._xy);
	if (item) { Game.text.write("%A is lying here.".format(item)); }

	Game.text.flush();
}

Player.prototype._pick = function(item) {
	Game.text.write("You pick up %a.".format(item));
	this._items.push(item);
	this._level.setItem(null, this._xy);
}

Player.prototype._initSlots = function() {
	for (var i=0;i<4;i++) {
		var slot = new Slot.Scale(i);
		this._slots.push(slot);
		var item = new Item.Scale(0).setStat("");
		this._items.push(item);
		slot.setItem(item);
	}

	for (var i=0;i<3;i++) {
		var slot = new Slot.Fin(i);
		this._slots.push(slot);
		var item = new Item.Fin(0).setStat("");
		this._items.push(item);
		slot.setItem(item);
	}

	var slot = new Slot.Jaws();
	this._slots.push(slot);
	var item = new Item.Jaws(0).setStat("");
	this._items.push(item);
	slot.setItem(item);
}
