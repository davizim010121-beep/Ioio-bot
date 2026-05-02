const Discord = require("discord.js")

const client = new Discord.Client({ 
  intents: [ 
    Discord.GatewayIntentBits.Guilds
  ]
});

module.exports = client

client.on('interactionCreate', (interaction) => {

  if(interaction.type === Discord.InteractionType.ApplicationCommand){

      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(`Error`);

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

      cmd.run(client, interaction)

   }
})

console.clear()

client.on('ready', () => {
  console.log(`🔥 Estou online em ${client.user.username}!`)
})

client.slashCommands = new Discord.Collection()

require('./handler')(client)

// 🔥 TOKEN DA RENDER
client.login(process.env.TOKEN)

client.on("interactionCreate", require('./events/consultas').execute);
