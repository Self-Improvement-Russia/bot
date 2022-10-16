const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user info.'),
	async execute(interaction) {
		const { db, initUser, DataError } = require('../database.js');
		let karma;
		try {
			karma = db.getData(`/users/${interaction.user.id}/karma/value`);
		} catch (e) {
			(e instanceof DataError) ? (initUser(interaction.user), karma = 0) : (throw(e));
		}
		return interaction.reply(`User: ${interaction.user}\nTag: ${interaction.user.tag}\nID: ${interaction.user.id}\nKarma: ${karma}`);
	},
};