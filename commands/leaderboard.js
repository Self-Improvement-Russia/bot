'use strict';
const { SlashCommandBuilder, ActionRowBuilder, ActionRow } = require('discord.js');
const { buttons, createLeaderboard } = require('../commands.js');
let leaderboard;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Replies with leaderboard')
		.setDMPermission(true),
	async execute(interaction) {
		await interaction.deferReply();
		let row = new ActionRowBuilder().addComponents(Object.values(buttons)), message;

		await createLeaderboard(leaderboard ?? null, interaction)
			.then(async (value) => {
				leaderboard = value;
				message = await interaction.editReply({ embeds: [leaderboard.embeds[0]], components: [row] });
			});

		const leaderboardCollector = message.createMessageComponentCollector(interaction.client, { componentType: ActionRow });
		let currentPage = 0;

		leaderboardCollector.on('collect', async i => {
			if (i.member !== interaction.member) {
				let message = { content: `${i.member}, это не твоё сообщение!`, ephemeral: true };
				(i.isRepliable()) ? await i.reply(message) : await i.followUp(message);
				return;
			}

			switch (i.customId) {
				case 'firstPage': currentPage = 0; break;
				case 'prevPage': currentPage--; break;
				case 'nextPage': currentPage++; break;
				case 'lastPage': currentPage = leaderboard.embeds.length - 1; break;
				default: await interaction.deleteReply(); return
			}

			buttons['prevPage'].setDisabled(currentPage === 0);
			buttons['nextPage'].setDisabled(currentPage === leaderboard.embeds.length - 1);
			row = new ActionRowBuilder().addComponents(Object.values(buttons));
			i.update({ embeds: [leaderboard.embeds[currentPage]], components: [row] });
		});

		leaderboardCollector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};


