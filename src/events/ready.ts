import { Events } from "discord.js";
import { ClientWithCommands } from "../bot";

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client: ClientWithCommands) {
		console.log(`Ready! Logged in as ${client.user?.tag}`);
	}
};
