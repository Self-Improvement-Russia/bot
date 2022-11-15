import { REST, Routes } from "discord.js";
import { clientId, guildId, token } from "../botConfig.json";
import fs from "node:fs";
import path from "node:path";

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter((file: string) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);
(async () => {
	try {
		await rest.put(Routes.applicationCommands(clientId), { body: [] });
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
		await rest.put(Routes.applicationCommands(clientId), { body: commands });
		console.log("Successfully reloaded application commands");
	} catch (e) {
		console.error(e);
	}
})();
