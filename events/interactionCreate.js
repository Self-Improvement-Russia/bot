'use strict';
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;
			try { await command.execute(interaction) }
			catch (e) { console.error(e); await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }) }
		}
		else if (interaction.isModalSubmit()) {
			try {
				interaction.guild.channels.cache.find(channel => channel.name === "отзывы").send(`Отзыв от: ${interaction.member}\n\`\`\`${interaction.fields.getTextInputValue('feedbackInput')}\`\`\``)
				interaction.reply({ content: '**Спасибо за отзыв!**', ephemeral: true })
			} catch (error) { interaction.reply({ content: `\`\`\`${error}\`\`\``, ephemeral: true }) }
		}
	},
};