require("dotenv").config();
const { token, datebaseToken } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits, EmbedBuilder, Partials, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.GuildPresences],
});
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

module.exports = client;

const recentMentions = new Map();

client.on('messageCreate', message => {
    if (message.mentions.users.size > 0) {
        recentMentions.set(message.id, {
            content: message.content,
            author: message.author.id,
            mentions: Array.from(message.mentions.users.values()).map(user => user.id),
            timestamp: message.createdTimestamp
        });

        setTimeout(() => {
            recentMentions.delete(message.id);
        }, 10000);
    }
});

client.on('messageDelete', message => {
    if (recentMentions.has(message.id)) {
        const ghostPing = recentMentions.get(message.id);
        logGhostPing(ghostPing);
    }
});

client.handleEvents();
client.handleCommands();
client.login(token);
(async () => {
  await connect(datebaseToken).catch(console.error);
})();
