require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const oldMembers = JSON.parse(fs.readFileSync("members.json", "utf-8"));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
  console.log(`🔄 Починаю синхронізацію ролей...`);

  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  await guild.members.fetch(); // Отримаємо всіх учасників

  let totalMatched = 0;
  let totalUpdated = 0;

  for (const member of guild.members.cache.values()) {
    const userData = oldMembers.find((u) => u.id === member.user.id);
    if (!userData) continue;

    totalMatched++;

    const currentRoleNames = member.roles.cache.map((r) => r.name);
    const rolesToAdd = [];

    for (const roleName of userData.roles) {
      if (!currentRoleNames.includes(roleName)) {
        const role = guild.roles.cache.find((r) => r.name === roleName);
        if (role) rolesToAdd.push(role);
      }
    }

    if (rolesToAdd.length > 0) {
      try {
        await member.roles.add(rolesToAdd);
        totalUpdated++;
        console.log(`✅ ${member.user.tag}: додано ролі [${rolesToAdd.map((r) => r.name).join(", ")}]`);
      } catch (err) {
        console.error(`❌ Помилка для ${member.user.tag}:`, err.message);
      }
    }
  }

  console.log(`\n🔍 Знайдено користувачів у списку: ${totalMatched}`);
  console.log(`✅ Ролі оновлено для: ${totalUpdated}`);
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
