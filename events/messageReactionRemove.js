module.exports = {
	name: 'messageReactionAdd',
	async execute(interaction) {
		if (interaction.channel.id !== '999969236019593262') return 0; // DELETE LATER

		const { db, initUser, DataError } = require('../database.js');
		let karma;
		try {
			karma = db.getData(`/users/${interaction.user.id}/karma/value`);
		} catch (e) {
			(e instanceof DataError) ? (initUser(interaction.user), karma = 0) : (throw(e));
		}

        await db.push(`/users/${interaction.user.id}/karma`, {
			value: karma - 1,
			changedAt: (new Date()).toUTCString(),
		});
		console.log(`-1 karma to ${interaction.user.tag}`);
	},
};