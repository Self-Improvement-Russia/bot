import fs from "node:fs";
import path from "node:path";
import {
	Client,
	Collection,
	ActionRow,
	GatewayIntentBits,
	ClientOptions,
	SlashCommandBuilder,
	Interaction,
	Partials,
	MessageComponentInteraction,
	GuildTextBasedChannel,
	ButtonInteraction,
	SelectMenuInteraction
} from "discord.js";
import { token, guildId, infoChannelId } from "../botConfig.json";
const { menu } = require("./commands/menu");

export class ClientWithCommands extends Client {
	constructor(params: ClientOptions) {
		super(params);
	}
	commands: Collection<string, { data: SlashCommandBuilder; execute: (interaction: Interaction) => void }> = new Collection();
}

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildEmojisAndStickers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.MessageContent
	/*
  GatewayIntentBits.GuildBans, 
  GatewayIntentBits.GuildMessageTyping, 
  GatewayIntentBits.GuildScheduledEvents, 
  GatewayIntentBits.DirectMessageReactions, 
  GatewayIntentBits.DirectMessageTyping, 
  GatewayIntentBits.GuildIntegrations, 
  GatewayIntentBits.GuildWebhooks, 
  GatewayIntentBits.GuildInvites, 
  GatewayIntentBits.GuildVoiceStates, 
  */
];

const client = new ClientWithCommands({ intents: intents, partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

// Initialize commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(path.join(commandsPath, file));
	client.commands.set(command.data.name, command);
}

// Initialize events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(path.join(eventsPath, file));
	if (event.once) client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
}

client.login(token).then();

(async () => {
	const infoChannel = (await (await client.guilds.fetch(guildId)).channels.fetch(infoChannelId)) as GuildTextBasedChannel;
	const filter = (i: MessageComponentInteraction) => i.message.createdAt.getTime() - Date.now() < 86400;
	// @ts-ignore
	const menuCollector = infoChannel.createMessageComponentCollector(client, { filter: filter, componentType: ActionRow });
	menuCollector.on("end", (collected: any) => console.log(`Collected ${collected.size} items`));
	menuCollector.on("collect", async (i: ButtonInteraction | SelectMenuInteraction) => {
		const id = i.customId as keyof typeof menu.messages;
		if (!menu.messages[id]) menu.actions(i);
		else await i.reply(menu.messages[id]);
	});
	console.log(`Collecting interactions from info channel (#${infoChannel.name})`);
})();
