const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Replies with leaderboard'),
	async execute(interaction) {
        
		return interaction.reply('Pong!');
	},
};