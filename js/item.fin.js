Item.Fin = function(type) {
	Item.call(this);

	this._visual.description = Item.TYPES[type].label + " fin";
	this._visual.fg = Item.TYPES[type].color;
}
Item.Fin.extend(Item);
