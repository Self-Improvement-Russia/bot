'use strict';
const { Client, Collection, IntentsBitField, Partials } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const intents = new IntentsBitField();
intents.add(
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	// IntentsBitField.Flags.GuildBans,
	IntentsBitField.Flags.GuildEmojisAndStickers,
	// IntentsBitField.Flags.GuildIntegrations, IntentsBitField.Flags.GuildWebhooks, IntentsBitField.Flags.GuildInvites, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildPresences,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildMessageReactions,
	// IntentsBitField.Flags.GuildMessageTyping, IntentsBitField.Flags.GuildScheduledEvents, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.DirectMessageReactions, IntentsBitField.Flags.DirectMessageTyping,
	IntentsBitField.Flags.DirectMessages);

const client = new Client({ intents: intents, partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) { client.once(event.name, (...args) => event.execute(...args)); }
	else { client.on(event.name, (...args) => event.execute(...args)); }
}

client.login(token).then(() => console.log('Logging in...'));
