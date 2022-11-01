'use strict';
const { db, initUser, dataError } = require('./database.js');
const { repEmojis } = require('./events/ready.js')

module.exports.reactionAction = async function reactionAction(reaction, member, factor) {
  if (reaction.partial) {
    try { await reaction.fetch() }
    catch (e) { console.error('Something went wrong when fetching the message:', e); return; }
  }

  let reputation;
  try { reputation = await db.getData(`/users/${reaction.message.author.id}/reputation/value`) }
  catch (e) { reputation = (e instanceof dataError) ? (await initUser(reaction.message.author)) : (() => { throw (e) }) }
  finally { reputation ??= 0 }

  let value = repEmojis.find(value => value[0] === reaction.emoji)[1] * factor
  await db.push('/users', { [reaction.message.author.id]: { reputation: { value: reputation + value, changedAt: (new Date()).toUTCString() } } }, false);
  console.log(`${(value > 0) ? ('+' + value) : (value)} rep to ${reaction.message.author.username} from ${member.username}`);
};
