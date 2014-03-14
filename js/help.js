var Help = function(first) {
	this._first = first;
	this._promise = new Promise();
}

Help.prototype.show = function() {
	Game.display.clear(); /* clear all */

	if (!this._first) { Game.status.update(); }
	this._draw();

	window.addEventListener("keydown", this);

	return this._promise;
}

Help.prototype.handleEvent = function(e) {
	if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) { return; }
	if (e.keyCode == ROT.VK_F11 || e.keyCode == ROT.VK_F5) { return; }
	if (this._first || e.keyCode == 27 || e.keyCode == ROT.VK_Z) {
		e.preventDefault();
		this._hide();
		this._promise.fulfill();
	}
}

Help.prototype._hide = function() {
	window.removeEventListener("keydown", this);
	Game.text.clear();
}

Help.prototype._draw = function() {
	Game.text.clear();
	if (this._first) {
		Game.text.write("Press %c{#fff}any key%c{} to start the game.");
	} else {
		Game.text.write("Press %c{#fff}Escape%c{} or %c{#fff}Z%c{} to return back to game.");
	}
	Game.text.flush();

	var x = 3, y = Game.TEXT_HEIGHT + 1;
	Game.display.drawText(x, y, "• To move around (8 directions), use %c{#fff}arrows%c{}, %c{#fff}numpad%c{} or %c{#fff}vim-keys%c{}.");
	y += 2;
	Game.display.drawText(x, y, "• To attack, move towards your target. To enter tunnels and pick items, press %c{#fff}Enter%c{}.");
	y += 2;
	Game.display.drawText(x, y, "• Press %c{#fff}i%c{} to open your inventory, %c{#fff}q%c{} to view quests, %c{#fff}?%c{} or %c{#fff},%c{} for this help screen.");
	y += 2;
	Game.display.drawText(x, y, "• Switch to fullscreen (%c{#fff}F11%c{}) for larger font.");

	y += 4;
	var x1 = 5, x2 = x1 + Math.round(Game.MAP_SIZE.x/3), x3 = x2 + Math.round(Game.MAP_SIZE.x/3);

	Game.display.drawText(x2, y, "%h".format(Game.player));
	y += 2;

	Game.display.drawText(x1, y, "%h".format(Cell.grass));
	Game.display.drawText(x2, y, "%c{#66f}≈%c{} water");
	Game.display.drawText(x3, y, "%h".format(Cell.shore));
	y += 1;
	Game.display.drawText(x1, y, "%h".format(Cell.wall));
	Game.display.drawText(x2, y, "%h".format(new Cell.Bubble()));
	Game.display.drawText(x3, y, "%h".format(new Cell.Seaweed()));
	y += 1;
	Game.display.drawText(x1, y, "%h".format(new Being.Fisher([250, 50, 50], new XY(1, 1))));
	Game.display.drawText(x2, y, "%c{#fff}<>%c{} underwater tunnel");
	Game.display.drawText(x3, y, "%c{#fff}?%c{} an item");

	y += 3;
	Game.display.drawText(x1, y, "%h".format(new Being.Seahorse()));
	Game.display.drawText(x2, y, "%h".format(new Being.Crab()));
	Game.display.drawText(x3, y, "%h".format(new Being.Starfish()));
	y += 1;
	Game.display.drawText(x1, y, "%h".format(new Being.Jellyfish()));
	Game.display.drawText(x2, y, "%h".format(new Being.Piranha()));
	Game.display.drawText(x3, y, "%h".format(new Being.Octopus()));
	y += 1;
	Game.display.drawText(x1, y, "%h".format(new Being.Snake()));
	Game.display.drawText(x2, y, "%h".format(new Being.LargeSnake()));
	Game.display.drawText(x3, y, "%h".format(new Being.Fish()));

}
