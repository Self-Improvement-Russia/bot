import { Events, GuildMember, TextChannel } from "discord.js";
import { welcomeChannelId } from "../config.json";

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    ((await member.guild.channels.fetch(welcomeChannelId)) as TextChannel).send(`${member} покинул Self Improvement Russia.`);
  },
};
