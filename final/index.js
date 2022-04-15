const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  data.guilds = data.guilds.map((guild) => {
    const dataF = { id: BigInt(guild.id), beforeMigration: true };
    if (guild.managementRoleId)
      dataF.permissions = {
        roles: {
          [guild.managementRoleId]: 4,
        },
      };
    if (guild.loggingChannelId)
      dataF.logChannelId = BigInt(guild.loggingChannelId);
    return dataF;
  });
  await prisma.guild.createMany({ data: data.guilds });
  data.channels = data.channels.map((channel) => {
    const dataF = { id: BigInt(channel.id) };
    const guildId = data.guilds.find(
      (guild) => guild.logChannelId === BigInt(channel.id)
    )?.id;
    if (guildId) {
      dataF.guildId = BigInt(guildId);
      if (channel.webhookId) dataF.webhookId = BigInt(channel.webhookId);
      if (channel.webhookToken) dataF.webhookToken = channel.webhookToken;
      return dataF;
    }
    return;
  });
  await prisma.channel.createMany({ data: data.channels });
})();
