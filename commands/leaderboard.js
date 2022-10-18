'use strict'
const { SlashCommandBuilder, ActionRowBuilder, ActionRow } = require('discord.js');
const { buttons, createLeaderboard } = require('../commands.js');

let leaderboard

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Replies with leaderboard')
		.setDMPermission(false),
	async execute(interaction) {
    let row = new ActionRowBuilder().addComponents(Object.values(buttons));
    let message;
		await createLeaderboard(leaderboard ?? null, interaction)
    .then(async (value) => {
        leaderboard = value;
        message = await interaction.reply({ embeds: [leaderboard['embeds'][0]], components: [row] });
    })

		const filter = i => { return interaction.user === i.user; };
		const leaderboardCollector = message.createMessageComponentCollector(interaction.client, { filter, componentType: ActionRow });
    let currentPage = 0;

		leaderboardCollector.on('collect', async i => {

			switch (i.customId) {
			case 'firstPage': currentPage = 0; break;
			case 'prevPage': currentPage--; break;
			case 'nextPage': currentPage++; break;
			case 'lastPage': currentPage = leaderboard.length - 1; break;
			default: await i.deleteReply();
			}

			buttons['prevPage'].setDisabled(currentPage === 0);
			buttons['nextPage'].setDisabled(currentPage === leaderboard.length - 1);
			row = new ActionRowBuilder().addComponents(Object.values(buttons));

			i.update({ embeds: leaderboard['embeds'][currentPage], components: [row] });
		});

		leaderboardCollector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};


