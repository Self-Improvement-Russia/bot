'use strict';
const { Embed, EmbedBuilder, ButtonComponent } = require('discord.js');
const { db } = require('./database.js');

module.exports.buttons = {
	firstPage: new ButtonComponent({ 'type': 1, 'components': [{ 'type': 2, 'style': 1, 'custom_id': 'firstPage' }] }),
	prevPage: new ButtonComponent({ 'type': 1, 'components': [{ 'type': 2, 'style': 2, 'custom_id': 'prevPage', 'disabled': true }] }),
	exit: new ButtonComponent({ 'type': 1, 'components': [{ 'type': 2, 'style': 4, 'custom_id': 'exit' }] }),
	nextPage: new ButtonComponent({ 'type': 1, 'components': [{ 'type': 2, 'style': 2, 'custom_id': 'nextPage' }] }),
	lastPage: new ButtonComponent({ 'type': 1, 'components': [{ 'type': 2, 'style': 1, 'custom_id': 'lastPage' }] }),
};

module.exports.createLeaderboard = async function createLeaderboard(oldLB, interaction) {
	const data = Object.entries(await db.getData('/users'));

	if (oldLB !== null) {
		let lastUpdate = Math.max(...(data.map(user => Date.parse(user[1].reputation.changedAt))));
		if (oldLB.date >= lastUpdate) return oldLB;
	}

	const sortedUsers = data.sort((a, b) => {
		return (a[1].reputation.value > b[1].reputation.value) ? -1 :
			(a[1].reputation.value < b[1].reputation.value) ? 1 : 0;
	});

	const userPlace = sortedUsers.findIndex((i) => { return (i[0] === interaction.user.id) ? 1 : 0 });
	const repEmoji = await interaction.guild.emojis.cache.find(emoji => emoji.name === 'gigachad');
	let leaderboard = [], embed;

	for (let i in sortedUsers) {
		if (i % 10 === 0) {
			if (embed) leaderboard = [...leaderboard, new Embed(embed.data)];
			embed = new EmbedBuilder()
				.setColor(0x2F3136)
				.setTitle('Рейтинг участников по репутации')
				.setThumbnail('https://cdn.discordapp.com/icons/999969234425761913/0ad835fb41365c7e01376ff1f0b13837.png?size=4096')
				.setDescription(`Твоё место в рейтинге: № ${+userPlace + 1}\nТвоя репутация: ${sortedUsers[userPlace][1].reputation.value} ${repEmoji}\n━━━━━━━━━━━━━━━━━\n`)
				.setFooter({ text: `стр. ${+(i / 10) + 1}/${Math.ceil(sortedUsers.length / 10)}` });
		}
		embed.data.description += `№ ${+i + 1}: ${await interaction.client.users.fetch(sortedUsers[i][0])} ${sortedUsers[i][1].reputation.value} ${repEmoji}\n`;
	}
	leaderboard = [...leaderboard, new Embed(embed.data)];
	return { embeds: leaderboard, date: Date.now() };
};
