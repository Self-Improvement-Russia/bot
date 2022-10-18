'use strict';
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			console.log(`${interaction.user.tag} triggered /${interaction.commandName} interaction in ${interaction.channel ? '#' + interaction.channel.name : 'DMs'}`);
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};