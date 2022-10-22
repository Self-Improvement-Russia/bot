'use strict';
const { Events } = require('discord.js');
const { reactionAction } = require('../events.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, member) {
		await reactionAction(reaction, member, 1);
	},
};
