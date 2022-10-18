const { reactionAction } = require('../events.js');

module.exports = {
	name: 'messageReactionAdd',
	async execute(interaction) {
		await reactionAction(interaction, +1);
	},
};