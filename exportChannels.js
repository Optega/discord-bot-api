require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  await guild.channels.fetch();
  await guild.roles.fetch();

  const rolesMap = {};
  guild.roles.cache.forEach((role) => {
    rolesMap[role.id] = role.name;
  });

  const channels = guild.channels.cache
    .sort((a, b) => a.position - b.position)
    .map((channel) => ({
      name: channel.name,
      type: channel.type,
      parent: channel.parent?.name || null,
      topic: channel.topic || null,
      nsfw: channel.nsfw || false,
      rateLimitPerUser: channel.rateLimitPerUser || 0,
      permissionOverwrites: channel.permissionOverwrites.cache.map((po) => ({
        id: po.id,
        type: po.type,
        allow: po.allow.bitfield.toString(),
        deny: po.deny.bitfield.toString(),
        roleName: rolesMap[po.id] || null,
      })),
    }));

  fs.writeFileSync("channels.json", JSON.stringify(channels, null, 2));
  console.log(`✅ Канали експортовані: ${channels.length}`);
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
