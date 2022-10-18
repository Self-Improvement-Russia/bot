const { ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require('./database.js');

module.exports.buttons = {
	firstPage: new ButtonBuilder()
		.setCustomId('firstPage')
		.setEmoji('⏪')
		.setStyle(ButtonStyle.Primary),
	prevPage: new ButtonBuilder()
		.setCustomId('prevPage')
		.setEmoji('◀️')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true),
	exit: new ButtonBuilder()
		.setCustomId('exit')
		.setEmoji('✖️')
		.setStyle(ButtonStyle.Danger),
	nextPage: new ButtonBuilder()
		.setCustomId('nextPage')
		.setEmoji('▶️')
		.setStyle(ButtonStyle.Secondary),
	lastPage: new ButtonBuilder()
		.setCustomId('lastPage')
		.setEmoji('⏩')
		.setStyle(ButtonStyle.Primary),
};
let cache = new WeakMap();
module.exports.createLeaderboard = async function createLeaderboard() {
    const data = Object.values(await db.getData('/users'));
    let shouldCreate = true

    if (cache["leaderboard"]) {
        let lastUpdate = Math.max(...(data.flat(1).map(user => Date.parse(user.karma.changedAt))))
        if (cache["leaderboard"].date >= lastUpdate) { shouldCreate = false; return cache["leaderboard"] }
    }

    if (shouldCreate) {
        cache["leaderboard"] = {content: [], date: Date.now()}
        return cache["leaderboard"]
    }
}