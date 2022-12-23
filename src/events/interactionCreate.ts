import { Interaction, TextBasedChannel } from "discord.js";
import { ClientWithCommands } from "../bot";
import { feedbackChannelId } from "../config.json";
const { menu } = require("../commands/menu");

module.exports = {
  name: "interactionCreate",
  async execute(interaction: Interaction & { client: ClientWithCommands }) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        command.execute(interaction);
      } catch (e) {
        console.error(e);
        await interaction.reply({ content: e as string, ephemeral: true });
      }
    } else if (interaction.isModalSubmit() && interaction.customId === "feedbackModal") {
      const feedbackChannel = (await interaction.guild!.channels.fetch(feedbackChannelId)) as TextBasedChannel;
      feedbackChannel!.send(`Отзыв от: ${interaction.member}\n\`\`\`${interaction.fields.getTextInputValue("feedbackInput")}\`\`\``);
      interaction.reply(menu.feedback.replyMsg);
    }
  },
};
