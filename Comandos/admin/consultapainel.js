const { ApplicationCommandType, PermissionFlagsBits, EmbedBuilder, StringSelectMenuBuilder,ActionRowBuilder } = require("discord.js")

module.exports = {
  name: "consultapainel", // Coloque o nome do comando
  description: "Puxe os dados do mlk", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,


  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        const {system_puxada} = require("../../config.json")
        const chanel = interaction.guild.channels.cache.get(system_puxada.channel_log_id)

        if(!chanel) return interaction.reply({content:"Canal de logs não definido"});
        
        interaction.reply({content:"Painel Puxadas ON", ephemeral:true})
        
        interaction.channel.send({
            embeds:[
                new EmbedBuilder()
                .setTitle("Consultar Dados")
                .setDescription("Puxe os dados da pessoa que te ameaça idiota, nossos serviços: \n\n **IP:** Localize a pessoa pelo ip dela \n **Cnpj:** Veja os dados do cnpj da pessoa \n **CEP:** Veja a localização do cep da pessoa \n **PLACA:** Consulte a placa do carro do zé buceta \n **CPF:** Puxar o Cpf do zé buceta que te roubo! \n **NOME:** Puxar o nome do menstruado \n **TELEFONE:** Puxar telefone do debiloide \n **EMAIL:** Puxar email do mano (Dificil)")
                .setColor("Blue")
                .setImage(`${system_puxada.thumbnail}`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId("painelpuxada")
                    .setPlaceholder("Escolha uma das formas de puxar dados")
                    .addOptions(
                        {
                            label:"IP",
                            description:"Puxar o ip do destinario",
                            value:"puxarip"
                        },
                        {
                            label:"CNPJ",
                            description:"Puxar o cnpj do destinario",
                            value:"puxarcnpj"
                        },
                        {
                            label:"CEP",
                            description:"Puxar o cep do destinario",
                            value:"puxarcep"
                        },
                        {
                            label:"PLACA",
                            description:"Puxar a placa do carro",
                            value:"puxarplaca"
                        },
                        {
                            label:"CPF",
                            description:"Puxar O dados do cpf",
                            value:"puxarcpf"
                        },
                        {
                            label:"NOME",
                            description:"Puxar O dados do nome",
                            value:"puxarnome"
                        },
                        {
                            label:"NUMERO",
                            description:"Puxar O dados do numero",
                            value:"puxarnumero"
                        },
                        {
                            label:"EMAIL",
                            description:"Puxar O dados do email",
                            value:"puxaremail"
                        },
                    )
                )
            ]
        })
    }


  }
}