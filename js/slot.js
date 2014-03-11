var Slot = function(itemCtor, visual, offset, labelOffset) {
	this._itemCtor = itemCtor;
	this._visual = visual;
	this._offset = offset;
	this._labelOffset = labelOffset;
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

Slot.prototype.getLabel = function() {
	var stat = this._item.getStatName();
	if (stat) {
		return Stats[stat].short + "+" + this._item.getStatValue();
	} else {
		return "";
	}
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
	
	offset = offset.plus(this._labelOffset);
	var len = 6;
	for (var i=0;i<len;i++) {
		Game.display.draw(offset.x+i, offset.y);
	}
	
	var str = this.getLabel();
	if (str) {
		offset.x += len - str.length;
		var color = ROT.Color.toRGB(this._item.getVisual().fg);
		Game.display.drawText(offset.x, offset.y, "%c{" + color + "}" + str);
	}
	
}

Slot.Scale = function(index) {
	var offsets = [new XY(19, 12), new XY(35, 12), new XY(19, 6), new XY(36, 7)];

	var visual = "\
 ,..._  \n\
      `.\n\
       |\n\
       ;\n\
`.___.'";
	Slot.call(this, Item.Scale, visual, offsets[index], new XY(0, 2));
}
Slot.Scale.extend(Slot);


Slot.Jaws = function() {
	var visual = '\
 _\n\
(_"-.,\n\
 (,-\'';
	Slot.call(this, Item.Jaws, visual, new XY(0, 12), new XY(6, 8));
}
Slot.Jaws.extend(Slot);

Slot.Fin = function(index) {
	/* dorsal, tail, pelvic */
	var offsets = [new XY(17, 0), new XY(57, 7), new XY(21, 18)];
	var labels = [new XY(36, 2), new XY(-4, -2), new XY(25, 4)];

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

	Slot.call(this, Item.Fin, visuals[index], offsets[index], labels[index]);
}
Slot.Fin.extend(Slot);

