import { Events, GuildMember, TextChannel } from "discord.js";
import { welcomeChannelId } from "../config.json";

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    ((await member.guild.channels.fetch(welcomeChannelId)) as TextChannel).send(`${member}, добро пожаловать на Self Improvement Russia!`);
  },
};
