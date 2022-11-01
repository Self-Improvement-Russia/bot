'use strict';
const { SlashCommandBuilder } = require('discord.js');
const { db } = require('../database.js');
const { repEmojis } = require('../events/ready.js');

async function fetchAllMessages(channel) {
	let messages = [];
	let message = await channel.messages
		.fetch({ limit: 1, after: '0' })
		.then(messagePage => ((messagePage.size === 1) ? (messagePage.at(0)) : null));

	while (message) {
		await channel.messages
			.fetch({ limit: 100, after: message.id })
			.then(messagePage => {
				messagePage.forEach(msg => messages.push(msg));
				message = (messagePage.size) ? (messagePage.at(messagePage.size - 1)) : null
			})
	}
	return messages
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('initdb')
		.setDescription('No description')
		.setDMPermission(false),
	async execute(interaction) {
		await interaction.reply(`Initializing... 0/${interaction.guild.channels.cache.size}`)
		let msgCount = 0, channelCount = 0;
		let reactionCount = { wojak: 0, gigachad: 0, bro: 0 }
		let channels = (await interaction.guild.channels.fetch()).values();
		for (let channel of channels) {
			channelCount++
			if (!channel.isTextBased()) continue;
			console.log(channelCount, interaction.guild.channels.cache.size)
			let messages = await fetchAllMessages(channel)
			msgCount += messages.size
			for (let message of messages) {
				if (!message.reactions.cache || message.author.bot) continue;
				let reactions = message.reactions.cache.values();
				for (let reaction of reactions) {
					if (!repEmojis.map(val => val[0]).includes(reaction.emoji)) continue;
					reactionCount[reaction.emoji.name] += reaction.count
				}
			}
		}
		console.log(msgCount, reactionCount)
		return await interaction.followUp('Finished')
	},
};
