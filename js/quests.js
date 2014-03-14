var Quests = function(quests) {
	this._promise = new Promise();
	this._quests = quests;
	Progress.questsOpened++;
}

Quests.prototype.show = function() {
	Game.display.clear(); /* clear all */
	Game.status.update(); /* draw status */
	this._draw();

	window.addEventListener("keydown", this);

	return this._promise;
}

Quests.prototype.handleEvent = function(e) {
	if (e.keyCode == 27 || e.keyCode == ROT.VK_Z) { /* close */
		e.preventDefault();
		window.removeEventListener("keydown", this);
		Game.text.clear();
		this._promise.fulfill();
	}
}

Quests.prototype._draw = function() {
	Game.text.clear();
	Game.text.write("Press %c{#fff}Escape%c{} or %c{#fff}Z%c{} to return back to game.");
	Game.text.flush();
	
	var x = 0;
	var y = 3;

	this._quests.forEach(function(quest, index) {
		if (quest.status == 3) { Game.display.drawText(x+1, y+index, "%c{#666}(done)"); }
		if (quest.status == 1 && Game.player.getItems().indexOf(quest.item) > -1) { 
			Game.display.drawText(x, y+index, "%c{#666}(found)"); 
		}
		var color = ROT.Color.toRGB(quest.fisher.getVisual().fg);
		var verb = (quest.status == 3 ? "wished" : "wishes");
		var text = "%c{"+color+"}A fisherman%c{} " + verb + " for %c{#fff}" + quest.item;
		Game.display.drawText(x+8, y+index, text);
	});
	
	if (!this._quests.length) {
		Game.display.drawText(x, y, "(You have not received any quests so far.)");
	}
}
