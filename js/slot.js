var Slot = function(itemCtor, visual, offset) {
	this._itemCtor = itemCtor;
	this._visual = visual;
	this._offset = offset;
	this._item = null;
}

Slot.prototype.accepts = function(item) {
	return (item instanceof this._itemCtor);
}

Slot.prototype.setItem = function(item) {
	this._item = item;
	return this;
}

Slot.prototype.getItem = function() {
	return this._item;
}

Slot.prototype.draw = function(inventoryOffset) {
	var offset = inventoryOffset.plus(this._offset);
	var lines = this._visual.split("\n");
	var fg = this._item.getVisual().fg;

	lines.forEach(function(line, index) { 
		for (var i=0;i<line.length;i++) {
			var ch = line.charAt(i);
			if (ch.match(/\s/)) { continue; }
			Game.display.draw(offset.x + i, offset.y + index, ch, ROT.Color.toRGB(fg));
		}
	});
}

Slot.Scale = function(index) {
	var offsets = [new XY(19, 12), new XY(35, 12), new XY(19, 6), new XY(36, 7)];

	var visual = "\
 ,..._  \n\
      `.\n\
       |\n\
       ;\n\
`.___.'";
	Slot.call(this, Item.Scale, visual, offsets[index]);
}
Slot.Scale.extend(Slot);


Slot.Jaws = function() {
	var visual = '\
 _\n\
(_"-.,\n\
 (,-\'';
	Slot.call(this, Item.Jaws, visual, new XY(0, 12));
}
Slot.Jaws.extend(Slot);

Slot.Fin = function(index) {
	/* dorsal, tail, pelvic */
	var offsets = [new XY(17, 0), new XY(57, 7), new XY(21, 18)];

	var visuals = ["\
        ,\n\
   /(  /:./\\\n\
,_/:`-/::/::/\\_ ,\n\
|:|::/::/::/::;'( ,,\n\
|:|:/::/::/:;'::,':(.(", 

"\
            _,.-::`.\n\
       _.-:::::::;'\n\
   _,-:::::::::;'\n\
,o:::::::::::;'\n\
HH:::::::;:;'\n\
HH::::::::(\n\
HH::::::::::.\n\
.H::::::::::::.\n\
  `-::::::::::::.\n\
      \"--.::::::::.\n\
            \"\"\"---'",

"\
\\::.:---.\n\
 \\::::::|\n\
  `.::::|\n\
    `.::|\n\
      `-'"];

	Slot.call(this, Item.Fin, visuals[index], offsets[index]);
}
Slot.Fin.extend(Slot);

