import { Events, MessageReaction, User } from "discord.js";
import { ownerId } from "../botConfig.json";

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction: MessageReaction, whoReacted: User) {
		if (reaction.partial) await reaction.fetch();
		if (whoReacted.id === ownerId && reaction.emoji.name === "👋") {
			if (!reaction.message.member) return;
			if (!reaction.message.member.presence) return;
			reaction.message.channel.send(`Привет, ${reaction.message.author}`);
		}
	}
};
