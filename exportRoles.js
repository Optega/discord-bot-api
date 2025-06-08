require("dotenv").config();
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  await guild.roles.fetch();

  const roles = guild.roles.cache
    .filter((role) => role.name !== "@everyone")
    .sort((a, b) => b.position - a.position)
    .map((role) => ({
      name: role.name,
      color: role.color,
      hoist: role.hoist,
      mentionable: role.mentionable,
      permissions: role.permissions.bitfield.toString(),
    }));

  fs.writeFileSync("roles.json", JSON.stringify(roles, null, 2));
  console.log(`✅ Експортовано ${roles.length} ролей у roles.json`);
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
