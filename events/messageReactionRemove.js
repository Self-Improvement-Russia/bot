const { reactionAction } = require('./messageReactionActions')

module.exports = {
	name: 'messageReactionRemove',
    async execute(interaction) { await reactionAction(interaction, -1); }
}