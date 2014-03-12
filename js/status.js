var Status = function(display) {
	this._display = display;
	this._offset = Game.TEXT_HEIGHT + Game.MAP_SIZE.y + 1;
}

Status.prototype.update = function() {
	/* first column */
	var x = 0;
	this._display.drawText(x, this._offset, "%c{" + ROT.Color.toRGB(Game.GOLD) + "}<*)))><");
	this._label(x, 1, "Turns");
	this.updatePart("turns");

	/* second column */
	x = 14;
	this._label(x, 0, Stats.attack.label);
	this.updatePart("attack");
	this._label(x, 1, Stats.defense.label);
	this.updatePart("defense");


	/* third column */
	x = 27;
	this._label(x, 0, Stats.sight.label);
	this.updatePart("sight");
	this._label(x, 1, Stats.speed.label);
	this.updatePart("speed");

	/* fourth column */
	x = 38;
	this._label(x, 0, Stats.hp.label);
	this.updatePart("hp");
	this._label(x, 1, Stats.o2.label);
	this.updatePart("o2");
}

Status.prototype.updatePart = function(part) {
	switch (part) {
		case "turns":
			var x = 7, y = 1, len = 5;
			this._erase(x, y, len);
			this._number(x + len - 1, y, Progress.turns);
		break;

		case "attack":
			var x = 23, y = 0, len = 2;
			this._erase(x, y, len);
			this._number(x + len - 1, y, Game.player.getStat(part));
		break;

		case "defense":
			var x = 23, y = 1, len = 2;
			this._erase(x, y, len);
			this._number(x + len - 1, y, Game.player.getStat(part));
		break;

		case "sight":
			var x = 34, y = 0, len = 2;
			this._erase(x, y, len);
			this._number(x + len - 1, y, Game.player.getStat(part));
		break;

		case "speed":
			var x = 34, y = 1, len = 2;
			this._erase(x, y, len);
			this._number(x + len - 1, y, Game.player.getStat(part));
		break;

		case "hp":
			var x = 42, y = 0;
			this._erase(x, y, Game.MAP_SIZE.x - x);
			var hp = Game.player.getStat("hp");
			var maxhp = Game.player.getStat("maxhp");
			var ch = "=";
			for (var i=0;i<hp; i++) {
				this._display.draw(x+i, y + this._offset, ch, "#f33");
			}
			for (var i=hp;i<maxhp; i++) {
				this._display.draw(x+i, y + this._offset, ch, "#800");
			}
		break;

		case "o2":
			var x = 42, y = 1;
			this._erase(x, y, Game.MAP_SIZE.x - x);
			var o2 = Game.player.getStat("o2");
			var maxo2 = Game.player.getStat("maxo2");
			var ch = "o";
			for (var i=0;i<o2; i++) {
				this._display.draw(x+i, y + this._offset, ch, "#33f");
			}
			for (var i=o2;i<maxo2; i++) {
				this._display.draw(x+i, y + this._offset, ch, "#008");
			}
		break;
	}
}

Status.prototype._label = function(x, y, str) {
	this._display.drawText(x, this._offset + y, str + ":");
}

Status.prototype._number = function(x, y, num) {
	var str = num + "";
	this._display.drawText(x - str.length + 1, this._offset + y, "%c{#fff}" + str);
}

Status.prototype._erase = function(x, y, count) {
	for (var i=0;i<count;i++) {
		this._display.draw(x+i, y+this._offset);
	}
}
