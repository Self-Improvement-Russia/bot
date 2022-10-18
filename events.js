'use strict'
module.exports.reactionAction = async function reactionAction(interaction, value) {
	const { db, initUser, dataError } = require('./database.js');
	let reputation;
	try {
		reputation = await db.getData(`/users/${interaction.message.author.id}/reputation/value`);
	} catch (e) {
		(e instanceof dataError) ? (await initUser(interaction.message.author.id)) : (() => {
			throw(e);
		});
		reputation = 0;
	}
	await db.push(`/users/${interaction.message.author.id}/reputation`, {
		value: reputation + value,
		changedAt: (new Date()).toUTCString(),
	});
	console.log(`${value > 0 ? '+' + value : value} rep to ${interaction.message.author.tag}`);
};
