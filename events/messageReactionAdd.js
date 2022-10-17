const { reactionAction } = require('./messageReactionActions')

module.exports = {
	name: 'messageReactionAdd',
    async execute(interaction) { await reactionAction(interaction, +1); }
}