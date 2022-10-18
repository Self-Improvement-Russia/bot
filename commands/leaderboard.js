const { SlashCommandBuilder, ActionRowBuilder, ActionRow } = require('discord.js');
const { buttons, createLeaderboard } = require('../commands.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Replies with leaderboard')
		.setDMPermission(false),
	async execute(interaction) {

		let currentPage = 0;
		const leaderboard = await createLeaderboard();
		console.log(typeof leaderboard['content'][0]);
		let row = new ActionRowBuilder().addComponents(Object.values(buttons));
		const message = await interaction.reply({ content: leaderboard['content'][0], components: [row] });
		const filter = i => { return interaction.user === i.user; };
		const leaderboardCollector = message.createMessageComponentCollector(interaction.client, { filter, componentType: ActionRow, });

		leaderboardCollector.on('collect', async i => {
			console.log(`${i.user.tag} pressed ${i.customId} leaderboard button`);
			switch (i.customId) {
			case 'firstPage':
        currentPage = 0
				buttons['nextPage'].setDisabled(false);
				buttons['prevPage'].setDisabled(true);
        row = new ActionRowBuilder().addComponents(Object.values(buttons));
        i.update({ content: leaderboard['content'][currentPage], components: [row] });
				break;
			case 'prevPage':
				buttons['nextPage'].setDisabled(false);
				buttons['prevPage'].setDisabled(currentPage === 1);
        row = new ActionRowBuilder().addComponents(Object.values(buttons));
        i.update({ content: leaderboard['content'][--currentPage], components: [row] });
				break;
			case 'nextPage':
        buttons['prevPage'].setDisabled(false);
				buttons['nextPage'].setDisabled(currentPage === leaderboard['content'].length - 2);
        row = new ActionRowBuilder().addComponents(Object.values(buttons));
        i.update({ content: leaderboard['content'][++currentPage], components: [row] });
				break;
			case 'lastPage':
        currentPage = leaderboard['content'].length - 1
        buttons['prevPage'].setDisabled(false);
				buttons['nextPage'].setDisabled(true);
        row = new ActionRowBuilder().addComponents(Object.values(buttons));
        i.update({ content: leaderboard['content'][currentPage], components: [row] });
        break
      default:
        await i.deleteReply();
			}
		});

		leaderboardCollector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};


