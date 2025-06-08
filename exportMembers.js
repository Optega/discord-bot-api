// exportMembers.js
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const filename = "members-new.json";

  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    await guild.members.fetch(); // Завантажити всіх учасників

    const members = guild.members.cache.map((member) => ({
      id: member.user.id,
      displayName: member.displayName,
      username: `${member.user.username}`,
      joinedAt: member.joinedAt,
      roles: member.roles.cache.filter((role) => role.name !== "@everyone").map((role) => role.name),
      timeoutUntil: member.communicationDisabledUntil ? member.communicationDisabledUntil.toISOString() : null,
    }));

    fs.writeFileSync(filename, JSON.stringify(members, null, 2));
    console.log(`📁 Експортовано ${members.length} учасників у ${filename}`);
  } catch (err) {
    console.error("❌ Помилка:", err);
  } finally {
    client.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);
