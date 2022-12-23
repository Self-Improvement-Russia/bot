import { SlashCommandBuilder, CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!").setDMPermission(true),
  async execute(interaction: CommandInteraction) {
    return interaction.reply(`Pong! (${interaction.client.ws.ping}ms)`);
  },
};
