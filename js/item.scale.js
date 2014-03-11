Item.Scale = function(type) {
	Item.call(this);

	this._visual.description = Item.TYPES[type].label + " scale";
	this._visual.fg = Item.TYPES[type].color;
}
Item.Scale.extend(Item);
