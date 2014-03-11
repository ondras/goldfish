var Stats = {};

Stats.all = ["hp", "maxhp", "o2", "maxo2", "speed", "sight", "attack", "defense"];

Stats.maxhp = {
	def: 2,
	short: "HP",
	label: "Vitality"
}

Stats.hp = {
	def: Stats.maxhp.def,
	label: "HP"
}

Stats.maxo2 = {
	def: 20,
	short: "O₂",
	label: "Breathing"
}

Stats.o2 = {
	def: Stats.maxo2.def,
	label: "O₂"
}

Stats.speed = {
	def: 20,
	label: "Speed",
	short: "SPD"
}

Stats.sight = {
	def: 7,
	label: "Sight",
	short: "SEE"
}

Stats.attack = {
	def: 10,
	label: "Attack",
	short: "ATK"
}

Stats.defense = {
	def: 10,
	label: "Defense",
	short: "DEF"
}
