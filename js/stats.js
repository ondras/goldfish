var Stats = {};

Stats.all = ["hp", "maxhp", "o2", "maxo2", "speed", "sight", "attack", "defense"];

Stats.maxhp = {
	def: 2
}

Stats.hp = {
	def: Stats.maxhp.def,
	label: "HP"
}

Stats.maxo2 = {
	def: 20,
}

Stats.o2 = {
	def: Stats.maxo2.def,
	label: "O₂"
}

Stats.speed = {
	def: 20,
	label: "Speed"
}

Stats.sight = {
	def: 7,
	label: "Sight"
}

Stats.attack = {
	def: 10,
	label: "Attack"
}

Stats.defense = {
	def: 10,
	label: "Defense"
}
