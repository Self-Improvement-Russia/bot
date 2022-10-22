'use strict';
const { Collection } = require('discord.js')

let repEmojis = new Collection();
module.exports.reactionAction = async function reactionAction(reaction, member, factor) {
  if (reaction.partial) {
		try { await reaction.fetch() }
    catch (e) { console.error('Something went wrong when fetching the message:', e); return; }
	}

	repEmojis.set('good', [reaction.message.guild.emojis.cache.find(emoji => emoji.name === 'gigachad'),
		reaction.message.guild.emojis.cache.find(emoji => emoji.name === 'bro')]);
	repEmojis.set('bad', [reaction.message.guild.emojis.cache.find(emoji => emoji.name === 'wojak')]);

  if (member === reaction.message.author || !repEmojis.some(value => value.includes(reaction.emoji))) return;

  const { db, initUser, dataError } = require('./database.js');
  let value = (repEmojis.good.includes(reaction.emoji)) ? 1 : (repEmojis.bad.includes(reaction.emoji)) ? -1 : 0;
  let reputation;

	try { reputation = await db.getData(`/users/${reaction.message.author.id}/reputation/value`) }
  catch (e) { reputation = (e instanceof dataError) ? (await initUser(reaction.message.author)) : (() => { throw (e) }) }
  finally { reputation ??= 0 }

	console.log(`${(value > 0) ? ('+' + value) : (value)} rep to ${reaction.message.author.tag} from ${reaction.member}`);
  await db.push('/users', {[reaction.message.author.id]: {reputation: {value: reputation + (value * factor), changedAt: (new Date()).toUTCString()}}}, false); return 0;
};
