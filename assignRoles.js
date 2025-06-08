require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const oldMembers = JSON.parse(fs.readFileSync("members.json", "utf-8"));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  const userData = oldMembers.find((u) => u.id === member.user.id);
  if (!userData) {
    try {
      const duration = 7 * 24 * 60 * 60 * 1000; // 1 тиждень у мс
      const reason = "Не знайдено в базі користувачів. Очікує перевірку.";

      await member.timeout(duration, reason);

      console.log(`🚫 ${member.user.tag} не знайдено в базі. Застосовується тимчасовий блок.`);
    } catch (err) {
      console.error(`❌ Помилка при застосуванні timeout до ${member.user.tag}:`, err);
    }

    return;
  }

  const guild = member.guild;
  const rolesToAssign = [];

  for (const roleName of userData.roles) {
    const role = guild.roles.cache.find((r) => r.name === roleName);
    if (role) rolesToAssign.push(role);
  }

  if (rolesToAssign.length > 0) {
    try {
      await member.roles.add(rolesToAssign);
      console.log(`✅ Додано ролі ${rolesToAssign.map((r) => r.name).join(", ")} користувачу ${member.user.tag}`);
    } catch (err) {
      console.error(`❌ Помилка при додаванні ролей ${member.user.tag}:`, err);
    }
  } else {
    console.log(`ℹ️ ${member.user.tag} не має відповідних ролей.`);
  }
});

client.login(process.env.DISCORD_TOKEN);
