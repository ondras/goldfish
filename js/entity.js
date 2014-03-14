var Entity = function(visual) {
	this._visual = visual;
	this._xy = null;
	this._level = null;
}

Entity.prototype.getVisual = function() {
	return this._visual;
}

Entity.prototype.getXY = function() {
	return this._xy;
}

Entity.prototype.getLevel = function() {
	return this._level;
}

Entity.prototype.setPosition = function(xy, level) {
	this._xy = xy;
	this._level = level;
	return this;
}

Entity.prototype.a = function() {
    var first = this._visual.description.charAt(0);
    return (first.match(/[aeiouy]/i) ? "an" : "a") + " " + this._visual.description;
}

Entity.prototype.the = function() {
    return "the " + this._visual.description;
}

Entity.prototype.it = function() {
    return "it";
}

Entity.prototype.verb = function(verb) {
    return verb + (verb.charAt(verb.length-1) == "s" ? "es" : "s");
}

Entity.prototype.toString = function() {
    return this._visual.description;
}

Entity.prototype.formatHelp  = function() {
	return "%c{" + ROT.Color.toRGB(this._visual.fg) + "}"  +this._visual.ch + "%c{} " + this._visual.description;
}

String.format.map.a = "a";
String.format.map.the = "the";
String.format.map.verb = "verb";
String.format.map.it = "it";
String.format.map.h = "formatHelp";
