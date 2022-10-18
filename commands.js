'use strict';
const { ButtonBuilder, ButtonStyle, Embed, EmbedBuilder } = require('discord.js');
const { db } = require('./database.js');

function createDefaultButton(id, emoji, style, disabled = false) {
	return (new ButtonBuilder).setCustomId(id).setEmoji(emoji).setStyle(ButtonStyle[style]).setDisabled(disabled);
}

module.exports.buttons = {
	firstPage: createDefaultButton('firstPage', '⏪', 'Primary'),
	prevPage: createDefaultButton('prevPage', '◀️', 'Secondary', true),
	exit: createDefaultButton('exit', '✖️', 'Danger'),
	nextPage: createDefaultButton('nextPage', '▶️', 'Secondary'),
	lastPage: createDefaultButton('lastPage', '⏩', 'Primary'),
};


module.exports.createLeaderboard = async function createLeaderboard(leaderboardOld, interaction) {
	const data = Object.entries(await db.getData('/users'));
	let shouldCreate = true;

	if (leaderboardOld !== null) {
		let lastUpdate = Math.max(...(data.map(user => Date.parse(user[1].reputation.changedAt))));
		if (leaderboardOld.date >= lastUpdate) {
			shouldCreate = false;
			return leaderboardOld;
		}
	}

	if (shouldCreate) {

		const sortedUsers = data.sort((a, b) => {
			return (a[1].reputation.value > b[1].reputation.value) ? -1 :
				(a[1].reputation.value < b[1].reputation.value) ? 1 : 0;
		});

		let userPlace = sortedUsers.findIndex((i) => { return (i[0] === interaction.user.id) ? 1 : 0; });
		let userRep = sortedUsers[userPlace][1].reputation.value;
		let repEmoji = await interaction.guild.emojis.fetch('1000812471415750756', { force: true });
		let leaderboard = [], embed;

		// userPlace - user id index in filtered list of only ids.
		// userPlace + userPlace - index in original unfiltered list.
		// +1 to get object next to id

		for (let i in sortedUsers) {
			if (i % 10 === 0) {
				if (embed) leaderboard = [...leaderboard, embed];
				embed = new EmbedBuilder()
					.setColor(0x2F3136)
					.setTitle('Рейтинг участников по репутации')
					.setThumbnail('https://cdn.discordapp.com/icons/999969234425761913/0ad835fb41365c7e01376ff1f0b13837.png?size=4096')
					.setDescription(`Твоё место в рейтинге: № ${+userPlace + 1}\nТвоя репутация: ${userRep} ${repEmoji}\n━━━━━━━━━━━━━━━━━\n`)
					.setFooter({ text: `стр. ${+(i / 10) + 1}/${Math.ceil(sortedUsers.length / 10)}` });
			}
			else if (i === sortedUsers.length - 1 && embed) leaderboard = [...leaderboard, embed];
      embed.data.description += `№ ${+i + 1}: ${await interaction.client.users.fetch(sortedUsers[i][0])}   ${sortedUsers[i][1].reputation.value} ${repEmoji}\n`
		}
		return { embeds: leaderboard, date: Date.now() };
	}
};