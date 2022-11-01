'use strict';
const { guildId, infoChannelId } = require('../config.json')
const { startCollector } = require('../commands/menu')

let repEmojis = [];
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`)
		let mainGuild = await client.guilds.fetch(guildId);
		let infoChannel = await mainGuild.channels.fetch(infoChannelId)
		repEmojis.push(...[
			[await mainGuild.emojis.cache.find(emoji => { return ['jeffery', 'jeffrey', 'wojak'].includes(emoji.name) }), -1],
			[await mainGuild.emojis.cache.find(emoji => { return ['gigachad', 'adonis'].includes(emoji.name) }), +1],
			[await mainGuild.emojis.cache.find(emoji => { return ['bro'].includes(emoji.name) }), +1]]);
		await startCollector(client, infoChannel);
	},
};

module.exports.repEmojis = repEmojis;