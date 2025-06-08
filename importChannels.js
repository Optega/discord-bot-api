require("dotenv").config();
const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require("discord.js");
const fs = require("fs");

const channelData = JSON.parse(fs.readFileSync("channels.json", "utf-8"));

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  await guild.roles.fetch();

  const roleMapByName = {};
  guild.roles.cache.forEach((role) => {
    roleMapByName[role.name] = role;
  });

  // Спочатку створюємо всі категорії
  const categories = {};
  for (const ch of channelData.filter((c) => c.type === ChannelType.GuildCategory)) {
    const category = await guild.channels.create({
      name: ch.name,
      type: ChannelType.GuildCategory,
    });
    categories[ch.name] = category;
  }

  // Потім всі канали
  for (const ch of channelData.filter((c) => c.type !== ChannelType.GuildCategory)) {
    const overwrites = ch.permissionOverwrites
      .filter((po) => po.roleName && roleMapByName[po.roleName])
      .map((po) => ({
        id: roleMapByName[po.roleName].id,
        type: po.type,
        allow: BigInt(po.allow),
        deny: BigInt(po.deny),
      }));

    const newChannel = await guild.channels.create({
      name: ch.name,
      type: ch.type,
      topic: ch.topic,
      nsfw: ch.nsfw,
      rateLimitPerUser: ch.rateLimitPerUser,
      parent: ch.parent ? categories[ch.parent] : null,
      permissionOverwrites: overwrites,
    });

    console.log(`✅ Створено канал ${ch.name}`);
  }

  console.log("🏁 Імпорт завершено");
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
