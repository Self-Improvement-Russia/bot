module.exports.reactionAction = async function reactionAction(interaction, value) {
	const { db, initUser, dataError } = require('../database.js');
	let karma;
	try {
		karma = await db.getData(`/users/${interaction.message.author.id}/karma/value`);
	} catch (e) {
		(e instanceof dataError) ? (initUser(interaction.message.author.id)) : (() => {
			throw(e);
		});
		karma = 0;
	}
	await db.push(`/users/${interaction.message.author.id}/karma`, {
		value: karma + value,
		changedAt: (new Date()).toUTCString(),
	});
	console.log(`${value > 0 ? "+" + value : value} karma to ${interaction.message.author.tag}`);
}
