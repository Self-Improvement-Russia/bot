import { Events, GuildMember, TextChannel } from "discord.js";

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member: GuildMember) {
		(await member.guild.channels.fetch("999969235314954332") as TextChannel).send(`Привет, ${member}`)
	}
};
