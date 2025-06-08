require("dotenv").config();
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  const botMember = await guild.members.fetch(client.user.id);

  const permissions = botMember.permissions.toArray();

  console.log(`🔐 Права бота на сервері "${guild.name}":`);
  permissions.forEach((p) => console.log(`• ${p}`));

  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
