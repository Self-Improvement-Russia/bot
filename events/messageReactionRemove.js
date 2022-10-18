'use strict';
const { reactionAction } = require('../events.js');

module.exports = {
	name: 'messageReactionRemove',
	async execute(interaction) {
		await reactionAction(interaction, -1);
	},
};