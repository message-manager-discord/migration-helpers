const { Client } = require("pg");
const fs = require("fs");
const client = new Client({
  connectionString: "",
});
(async () => {
  console.log("connecting");
  await client.connect();
  console.log("connected");

  console.log("querying");
  const guilds = (await client.query(`SELECT * FROM guilds`)).rows;
  console.log("queried");

  console.log(guilds.length);
  const loggingChannels = (await client.query(`SELECT * FROM logging_channels`))
    .rows;
  const final = { guilds: [], channels: [] };
  for (let index = 0; index < guilds.length; index++) {
    const guild = guilds[index];
    console.log(index);

    const loggingChannel = loggingChannels.find(
      (channel) => channel.guild_id === guild.id
    );
    final.guilds.push({
      id: guild.id,
      managementRoleId: guild.management_role_id,
      loggingChannelId: loggingChannel ? loggingChannel.channel_id : null,
    });
  }
  console.log("querying");
  const channels = (await client.query(`SELECT * FROM channels`)).rows;
  console.log("queried");
  console.log(channels.length);
  for (let index = 0; index < channels.length; index++) {
    const channel = channels[index];
    console.log(index);
    final.channels.push({
      id: channel.id,
      webhookId: channel.webhook_id,
      webhookToken: channel.webhook_token,
    });
  }
  console.log("writing");
  fs.writeFileSync("./data.json", JSON.stringify(final, null, 2), "utf-8");
  console.log("written");
})();
