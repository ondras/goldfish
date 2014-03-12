var Stats = {};

Stats.all = ["hp", "maxhp", "o2", "maxo2", "speed", "sight", "attack", "defense"];
Stats.avail = ["maxhp", "maxo2", "speed", "sight", "attack", "defense"];

Stats.maxhp = {
	def: 20, /* shall be no more than ~55 in order to fit a 100-width */
	short: "HP",
	label: "Vitality",
	random: [1, [2, 3], [3, 4], [4, 5]]
}

Stats.hp = {
	def: Stats.maxhp.def,
	label: "HP"
}

Stats.maxo2 = {
	def: 20,
	short: "O₂",
	label: "Breathing",
	random: Stats.maxhp.random
}

Stats.o2 = {
	def: Stats.maxo2.def,
	label: "O₂"
}

Stats.speed = {
	def: 50,
	label: "Speed",
	short: "SPD",
	random: [[2, 5], [4, 8], [7, 10], [9, 15]]
}

Stats.sight = {
	def: 7,
	label: "Sight",
	short: "SEE",
	random: [1, 2, 3, 4]
}

Stats.attack = {
	def: 20,
	label: "Attack",
	short: "ATK",
	random: [1, [2, 3], [3, 4], [4, 5]]
}

Stats.defense = {
	def: 20,
	label: "Defense",
	short: "DEF",
	random: Stats.attack.random
}
