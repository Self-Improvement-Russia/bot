const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Replies with leaderboard')
        .setDMPermission(false),
	async execute(interaction) {
        
		return interaction.reply('Pong!');
	},
};