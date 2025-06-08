require("dotenv").config();
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const fs = require("fs");

const rolesData = JSON.parse(fs.readFileSync("roles.json", "utf-8"));

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);

  for (const roleData of rolesData.reverse()) {
    // reverse щоб зберегти порядок
    try {
      await guild.roles.create({
        name: roleData.name,
        color: roleData.color,
        hoist: roleData.hoist,
        mentionable: roleData.mentionable,
        permissions: new PermissionsBitField(BigInt(roleData.permissions)),
      });
      console.log(`✅ Створено роль ${roleData.name}`);
    } catch (err) {
      console.error(`❌ Помилка створення ролі ${roleData.name}:`, err.message);
    }
  }

  console.log("🏁 Усі ролі імпортовано");
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
