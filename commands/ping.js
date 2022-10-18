'use strict';
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setDMPermission(true),
	async execute(interaction) {
		return interaction.reply(`Pong! (${interaction.client.ws.ping}ms)`);
	},
};