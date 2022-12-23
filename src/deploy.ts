import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { REST, Routes } from "discord.js";
import { appId, guildId } from "./config.json";
import fs from "node:fs";
import path from "node:path";

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter((file: string) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN as string);
(async () => {
  try {
    await rest.put(Routes.applicationCommands(appId), { body: [] });
    await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: [] });
    await rest.put(Routes.applicationCommands(appId), { body: commands });
    console.log("Successfully reloaded application commands");
  } catch (e) {
    console.error(e);
  }
})();
