'use strict';
const { Events } = require('discord.js');
const { reactionAction } = require('../events.js');
const { repEmojis } = require('./ready.js');

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(reaction, member) {
		if (member === reaction.message.author || !repEmojis.find(element => element[0] === reaction.emoji)) return;
		await reactionAction(reaction, member, -1);
	},
};
