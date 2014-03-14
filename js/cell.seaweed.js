Cell.Seaweed = function() {
	Cell.call(this, {
		ch: "(",
		fg: [40, 200, 40],
		description: "seaweed"
	}, false);
}
Cell.Seaweed.extend(Cell);

Cell.Seaweed.prototype.setPosition = function(xy, level) {
	Cell.prototype.setPosition.call(this, xy, level);
	this._visual.ch = ((xy.x+xy.y) % 2 ? "(" : ")");
}

Cell.Seaweed.prototype.enter = function(being) {
	var hp = being.getStat("hp");
	var maxhp = being.getStat("maxhp");
	
	if (hp < maxhp) {
		being.adjustStat("hp", Math.min(Rules.SEAWEED_HEAL, maxhp-hp));
		
		if (being == Game.player) { Game.text.write("You heal yourself a bit by eating some seaweed."); }
		this._level.setCell(null, this._xy);
	}
}
