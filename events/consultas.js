const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder} = require("discord.js");
const {consultar} = require('consulta-cnpj-br');
const cep = require('cep-promise');
const ip = require('ip-promise');
const axios = require('axios');
const config = require("../config.json");
module.exports = {
    name: 'consultas',
    async execute(interaction, message, client) {

        const channelss = config.system_puxada.channel_log_id
        const canau = interaction.guild.channels.cache.get(channelss)
        if(interaction.isStringSelectMenu() && interaction.customId === "painelpuxada"){

            const member = interaction.member;
            const roles = member.roles.cache;
            const hasRequiredRole = config.system_puxada.cargos_id.some(roleId => roles.has(roleId));
            const options = interaction.values[0];


            if (!config.system_puxada.user_ids.includes(interaction.user.id) && !hasRequiredRole) {
                interaction.reply({
                    content:"Você não tem acesso ao vip!",
                    ephemeral:true
                })

                return;
            }

        

            if( options === "puxarip"){

                const modal = new ModalBuilder()
                .setCustomId("modal_ip")
                .setTitle("Puxar Ip")

                const ip = new TextInputBuilder()
                .setCustomId("ip_text")
                .setStyle(1)
                .setLabel("Coloque algum ip")
                .setValue("127.0.0.1")
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(ip))

                return interaction.showModal(modal)

            }
            if( options === "puxarcnpj"){
                const modal = new ModalBuilder().setCustomId("modal_cnpj").setTitle("Puxar Cnpj")

                const text = new TextInputBuilder()
                .setCustomId("cnpj_text")
                .setLabel("Coloque o Cnpj Aqui")
                .setPlaceholder("Digite aqui ✏")
                .setStyle(1)
    
                modal.addComponents(new ActionRowBuilder().addComponents(text))
                
                return interaction.showModal(modal)

            }
            if( options === "puxarcep"){
                const modal = new ModalBuilder()
                .setCustomId("modal_cep")
                .setTitle("Puxar Cep")

                const cep = new TextInputBuilder()
                .setCustomId("cep_text")
                .setStyle(1)
                .setLabel("Coloque algum cep")
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(cep))

                return interaction.showModal(modal)


            }
            if( options === "puxarplaca"){

                const modal = new ModalBuilder()
                .setCustomId("modal_placa")
                .setTitle("Puxar Placa")

                const cnpj = new TextInputBuilder()
                .setCustomId("placa_text")
                .setStyle(1)
                .setLabel("Coloque alguma placa")
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(cnpj))

                return interaction.showModal(modal)

            }
            if( options === "puxarcpf"){

                const modal = new ModalBuilder()
                .setCustomId("modal_cpf")
                .setTitle("Puxar Cpf")

                const cnpj = new TextInputBuilder()
                .setCustomId("cpf_text")
                .setStyle(1)
                .setLabel("Digite o CPF")
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(cnpj))

                return interaction.showModal(modal)

            }
            if( options === "puxarnome"){

                const modal = new ModalBuilder()
                .setCustomId("modal_nome")
                .setTitle("Puxar Nome")

                const cnpj = new TextInputBuilder()
                .setCustomId("nome_text")
                .setStyle(1)
                .setLabel("Digite o nome")
                .setPlaceholder("Precisa ser o nome completo!")
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(cnpj))

                return interaction.showModal(modal)

            }
            if( options === "puxarnumero"){

                const modal = new ModalBuilder()
                .setCustomId("modal_numero")
                .setTitle("Puxar numero")

                const cnpj = new TextInputBuilder()
                .setCustomId("numero_text")
                .setStyle(1)
                .setLabel("Digite o numero")
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(cnpj))

                return interaction.showModal(modal)

            }
            if( options === "puxaremail"){

                const modal = new ModalBuilder()
                .setCustomId("modal_email")
                .setTitle("Puxar Email")

                const cnpj = new TextInputBuilder()
                .setCustomId("email_text")
                .setStyle(1)
                .setLabel("Digite o email")
                .setPlaceholder("Possivelmente você não encontrara!")
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(cnpj))

                return interaction.showModal(modal)

            }
        }


        if (interaction.isModalSubmit() && interaction.customId === "modal_email") {
            const placa = interaction.fields.getTextInputValue("email_text");
            const user = interaction.user;
          
            const man = await interaction.reply({ content: "Estamos consultando, aguarde um momento...", ephemeral: true });
          
            try {
              const url = `https://apisdedicado.nexos.dev/SerasaEmail/email?token=2ae274ad75c45b657547631a82358dbc&email=${placa}`;
              const response = await axios.get(url);
          
              if (response.status === 200) {
                const data = response.data.results[0]; 
          
                const Nome = data.NOME;
                const cpf = data.CPF;
                const Renda = data.RENDA;
                const sexo = data.SEXO === "M" ? "M - Masculino" : "F - Feminino";
                const nascimento = data.NASC;
                const nome_mae = data.NOME_MAE;
          
                const embed = new EmbedBuilder()
                  .setTitle('「 C O N S U L T A  D E  E M A I L 」')
                    
          
                embed.addFields({ name: 'Email', value: `${placa}`, inline: true });
                embed.addFields({ name: 'Nome', value: `${Nome}`, inline: true });
                embed.addFields({ name: 'CPF', value: `${cpf}`, inline: true });
                embed.addFields({ name: 'Renda', value: `${Renda}`, inline: true });
                embed.addFields({ name: 'Sexo', value: `${sexo}`, inline: true });
                embed.addFields({ name: 'Nascimento', value: `${nascimento}`, inline: true });
                embed.addFields({ name: 'Nome da Mãe', value: `${nome_mae}`, inline: true });
          
                user.send({ embeds: [embed] }).then((msg) => {
                  interaction.editReply({ content: `Sua consulta foi um sucesso! Verifique sua dm: ${msg.url}` });
                });
          
                canau.send({
                  content: "Nova consulta encontrada...",
                  embeds: [
                    embed.setDescription(`**O Usuario ${interaction.user}, está consultando email, aqui está o resultado:**`)
                  ]
                });
              }
            } catch (error) {
              interaction.editReply('Este email não foi encontrado!');
            }
          }
          




        if (interaction.isModalSubmit() && interaction.customId === "modal_numero") {
            const placa = interaction.fields.getTextInputValue("numero_text");
            const user = interaction.user;
          
            const man = await interaction.reply({ content: "Estamos consultando, aguarde um momento...", ephemeral: true });
          
            try {
              const url = `https://apisdedicado.nexos.dev/SerasaTelefones/telefone?token=2ae274ad75c45b657547631a82358dbc&telefone=${placa}`;
              const response = await axios.get(url);
          
              if (response.status === 200) {
                const data = response.data.results;
          
                const cpf = data.CPF;
                const nome = data.NOME;
                const sexo = data.SEXO === "M" ? "M - Masculino" : "F - Feminino";
                const nascimento = data.NASC;
          
                const embed = new EmbedBuilder()
                  .setTitle('「 C O N S U L T A  D E  T E L E F O N E 」')
                    
          
                embed.addFields({ name: 'Telefone', value: `${placa}`, inline: true });
                embed.addFields({ name: 'CPF', value: `${cpf}`, inline: true });
                embed.addFields({ name: 'Nome', value: `${nome}`, inline: true });
                embed.addFields({ name: 'Sexo', value: `${sexo}`, inline: true });
                embed.addFields({ name: 'Nascimento', value: `${nascimento}`, inline: true });
          
                user.send({ embeds: [embed] }).then((msg) => {
                  interaction.editReply({ content: `Sua consulta foi um sucesso! Verifique sua dm: ${msg.url}` });
                });
          
                canau.send({
                  content: "Nova consulta encontrada...",
                  embeds: [
                    embed.setDescription(`**O Usuario ${interaction.user}, está consultando nome, aqui está o resultado:**`)
                  ]
                });
          
              }
            } catch (error) {
              interaction.editReply('Este número não foi encontrado!');
            }
          }
          

        if (interaction.isModalSubmit() && interaction.customId === "modal_nome") {
            const placa = interaction.fields.getTextInputValue("nome_text");
            const user = interaction.user;
          
            const man = await interaction.reply({ content: "Estamos consultando, aguarde um momento...", ephemeral: true });
          
            try {
              const url = `https://apisdedicado.nexos.dev/SerasaNome/nome?token=2ae274ad75c45b657547631a82358dbc&nome=${placa}`;
              const response = await axios.get(url);
          
          
              if (response.status === 200) {
                const userData = response.data.results.map(dados => ({
                  Nome: dados.NOME,
                  cpf: dados.CPF,
                  Renda: dados.RENDA,
                }));
          
                const embed = new EmbedBuilder()
                  .setTitle('「 C O N S U L T A  D E  N O M E 」')
                   
          
                userData.forEach(dados => {
                  embed.addFields({ name: 'Nome', value: `${dados.Nome}`, inline: true });
                  embed.addFields({ name: 'CPF', value: `${dados.cpf}`, inline: true });
                  embed.addFields({ name: 'Renda', value: `${dados.Renda}`, inline: true });
                });
          

                user.send({ embeds: [embed] }).then((msg) => {
                    interaction.editReply({ content: `Sua consulta foi um sucesso! Verifique sua dm: ${msg.url}` });
                  });


                canau.send({
                  content: "Nova consulta encontrada...",
                  embeds: [
                    embed.setDescription(`**O Usuario ${interaction.user}, está consultando nome, aqui está o resultado:**`)
                  ]
                });
          
                
              }
            } catch (error) {
              interaction.editReply('Este nome não foi encontrado!');
            }
          }
          












        if(interaction.isModalSubmit() && interaction.customId === "modal_cpf"){
            const placa = interaction.fields.getTextInputValue("cpf_text");
            const user = interaction.user;
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

           const man = await interaction.reply({content:"Estamos consultando, aguarde um momento...", ephemeral:true})

try {
    
      const auth = {
        username: 'umbler',
        password: 'testehospedagem',
      };

      
      const url = `https://schemapossewhitehats-com.umbler.net/cpf.php?consulta=${placa}`;

      
      const response = await axios.get(url, { auth });

      if (response.data.includes("Por favor digite um CPF válido")) {
        man.edit('Por favor digite um CPF válido');
        return;
    } 
      if (response.status === 200) {
        const textoFormatado = response.data.replace(/<br>/g, '\n');
        const embed = new EmbedBuilder()
          .setTitle('「 C O N S U L T A  D E  C P F 」')
          .setDescription(textoFormatado);

          const embed1 = new EmbedBuilder()
          .setTitle('「 C O N S U L T A  D E  C P F 」')
          .setDescription(textoFormatado);

          

          canau.send({ content:"Nova consulta encontrada...", embeds:[
            embed1.setDescription(`**O Usuario ${interaction.user}, está consultando cpf, aqui está o resultado:**\n\n` + textoFormatado)
          ]})
        user.send({embeds:[embed]}).then((msg) => {
            
        interaction.editReply({content:`Sua consulta foi um sucesso! Verifique sua dm: ${msg.url}`})
        })
      } else {
        interaction.editReply('Ocorreu um erro na hora consulta');
      }
    } catch (error) {
      console.error(error);
      interaction.editReply('Ocorreu um erro na hora da consulta');
    }
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_ip"){
            const cep1 = interaction.fields.getTextInputValue("ip_text");
            const user = interaction.user

            interaction.reply({content: "Estamos Consultando, Aguarde um momento....", ephemeral:true})
            ip(`${cep1}`)
  .then(async (dados) => {

    console.log(dados)
    canau.send({
        content:"Nova Consulta!",
        embeds:[
            new EmbedBuilder()
            .setTitle("*「 C O N S U L T A  D E  I P 」*")
            .setDescription(`**O usuario ${interaction.user}, está consultando o ip, aqui está o resultado:**`)
            .addFields(
                {
                    name:"Cidade",
                    value:`${dados.state}`,
                    inline:true
                },
                {
                    name:"Cidade",
                    value:`${dados.city}`,
                    inline:true
                },
                {
                    name:"País",
                    value:`${dados.country}`,
                    inline:true
                }
            )
        ]
      })
  user.send({
    embeds:[
        new EmbedBuilder() 
        .setTitle("*「 C O N S U L T A  D E  I P 」*")
        .addFields(
            {
                name:"Cidade",
                value:`${dados.state}`,
                inline:true
            },
            {
                name:"Cidade",
                value:`${dados.city}`,
                inline:true
            },
            {
                name:"País",
                value:`${dados.country}`,
                inline:true
            }
        )
    ]
  }).then((msg) => {
    interaction.editReply({content:`Sua Consulta de ip foi um sucesso! verifique sua dm: ${msg.url}`})
  })
				
  
  	}).catch(async (err) => {
				console.log(err)
				interaction.editReply('ip não encontrado.')
				})

        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_cnpj"){
            const cep1 = interaction.fields.getTextInputValue("cnpj_text");
            const user = interaction.user

            interaction.reply({content:"Estamos Consultando seu cnpj, aguarde um momento...", ephemeral:true})
            consultar(`${cep1}`)
  .then(async (dados) => {
    canau.send({
        
        
        content:"Nova busca foi encontrada!",

        embeds:[
        new EmbedBuilder()
        .setTitle("*「 C O N S U L T A  D E  C N P J 」*")
        .setDescription(`**O Usuario ${interaction.user} tentou consultar o CNPJ: ${cep1}, aqui está os dados:**`)
        .addFields(
            {
                name: "Razão Social",
                value: `${dados.razaosocial}`,
                inline: true
              },
              {
                name: "Situação",
                value: `${dados.situacao}`,
                inline: true
              },
              {
                name: "Logradouro",
                value: `${dados.logradouro}`,
                inline: true
              },
              {
                name: "Número",
                value: `${dados.numero}`,
                inline: true
              },
              {
                name: "Bairro",
                value: `${dados.bairro}`,
                inline: true
              },
              {
                name: "CEP",
                value: `${dados.cep}`,
                inline: true
              },
              {
                name: "UF",
                value: `${dados.uf}`,
                inline: true
              },
              {
                name: "Município",
                value: `${dados.municipio}`,
                inline: true
              },
              {
                name: "Nome Fantasia",
                value: `${dados.nomefantasia}`,
                inline: true
              }
            
        )]})

     user.send({embeds:[
        new EmbedBuilder()
        .setTitle("*「 C O N S U L T A  D E  C N P J 」*")
        .addFields(
            {
                name: "Razão Social",
                value: `${dados.razaosocial}`,
                inline: true
              },
              {
                name: "Situação",
                value: `${dados.situacao}`,
                inline: true
              },
              {
                name: "Logradouro",
                value: `${dados.logradouro}`,
                inline: true
              },
              {
                name: "Número",
                value: `${dados.numero}`,
                inline: true
              },
              {
                name: "Bairro",
                value: `${dados.bairro}`,
                inline: true
              },
              {
                name: "CEP",
                value: `${dados.cep}`,
                inline: true
              },
              {
                name: "UF",
                value: `${dados.uf}`,
                inline: true
              },
              {
                name: "Município",
                value: `${dados.municipio}`,
                inline: true
              },
              {
                name: "Nome Fantasia",
                value: `${dados.nomefantasia}`,
                inline: true
              }
            
        )]}).then((msg) => {
            interaction.editReply({
                content:`Sua consulta foi um sucesso! Verifique sua DM: ${msg.url}`
            })
        })
    
    
    
  }).catch(err => {
    console.log(err);
    interaction.editReply({content:"Não conseguir encontrar o cnpj!"})
  });
        }



        if(interaction.isModalSubmit() && interaction.customId === "modal_cep"){
            const cep1 = interaction.fields.getTextInputValue("cep_text");
            const user = interaction.user

            interaction.reply({content: "Aguarde, estamos consultando o cep...", ephemeral:true})
            
            cep(`${cep1}`)
  .then(async (dados) => {


    canau.send({
        content:"Nova Consulta foi Encontrada!",
        embeds:[
            new EmbedBuilder()
            .setTitle("*「 C O N S U L T A  D E  C E P 」*")
            .setDescription(`**O Usuario ${interaction.user}, está consultando o CEP, aqui está a consulta:**`)
            .addFields(
                {
                    name:"Cep",
                    value:`${dados.cep}`,
                    inline:true
                },
                {
                    name:"Cidade",
                    value:`${dados.city}`,
                    inline:true
                },
                {
                    name:"Estado",
                    value:`${dados.state}`,
                    inline:true
                },
                {
                    name:"Rua",
                    value:`${dados.street}`,
                    inline:true
                },
                {
                    name:"Bairro",
                    value:`${dados.neighborhood}`,
                    inline:true
                },
            )
        ]
    })

				 user.send({
                    embeds:[
                        new EmbedBuilder()
                        .setTitle("*「 C O N S U L T A  D E  C E P 」*")
                        .addFields(
                            {
                                name:"Cep",
                                value:`${dados.cep}`,
                                inline:true
                            },
                            {
                                name:"Cidade",
                                value:`${dados.city}`,
                                inline:true
                            },
                            {
                                name:"Estado",
                                value:`${dados.state}`,
                                inline:true
                            },
                            {
                                name:"Rua",
                                value:`${dados.street}`,
                                inline:true
                            },
                            {
                                name:"Bairro",
                                value:`${dados.neighborhood}`,
                                inline:true
                            },
                        )
                    ]
                }).then((msg) => {
                    interaction.editReply({
                        content:`Sua consulta foi um sucesso! Verifique sua dm: ${msg.url}`
                    })
                })
  
  	}).catch(async (err) => {
				console.log(err)
				 interaction.editReply({content:'CEP não encontrado.'})
				})
	


        }
    //     if(interaction.isModalSubmit() && interaction.customId === "modal_placa"){
    //         const placa = interaction.fields.getTextInputValue("placa_text");
    //         const user = interaction.user
            

    // interaction.reply({
    //     content:"Aguarde um momento, estamos consultando sua placa",
    //     ephemeral:true
    // })

    //         consultarPlaca(`${placa}`).then(async (dados) => {
                

    //             canau.send({
    //                 content:"Nova Consulta encontrada!",
    //                 embeds:[
    //                     new EmbedBuilder() 
    //                     .setTitle("*「 C O N S U L T A  D E  P L A C A 」*")
    //                     .setDescription(`**O Usuario ${interaction.user}, consultou a placa ${placa}, aqui está a consulta:**`)
    //                     .addFields(
    //                         {
    //                             name:"Marca",
    //                             value:`${dados.marca}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Modelo",
    //                             value:`${dados.modelo}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Ano de Fabricação",
    //                             value:`${dados.anoFabricacao}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Ano Modelo",
    //                             value:`${dados.anoModelo}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Cor",
    //                             value:`${dados.cor}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Cilindrada",
    //                             value:`${dados.cilindrada}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Potencia",
    //                             value:`${dados.potencia}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"combustivel",
    //                             value:`${dados.combustivel}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Chassi",
    //                             value:`${dados.chassi}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Estado",
    //                             value:`${dados.uf}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"municipio",
    //                             value:`${dados.municipio}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Importado?",
    //                             value:`${dados.importado}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Peso Bruto",
    //                             value:`${dados.pesoBrutoTotal}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Capacidade Tração",
    //                             value:`${dados.capMaxTracao}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"tipo de veiculo",
    //                             value:`${dados.tipoVeiculo}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Especie de Veiculo",
    //                             value:`${dados.especieVeiculo}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Quantia de Passageiros",
    //                             value:`${dados.passageiros}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Segmento",
    //                             value:`${dados.segmento}`,
    //                             inline:true
    //                         },
    //                         {
    //                             name:"Capacidade de Carga",
    //                             value:`${dados.capacidadeCarga}`,
    //                             inline:true
    //                         },
    //                     )
    //                 ] 
    //                 })
    //          user.send({
    //         embeds:[
    //             new EmbedBuilder()
    //             .setTitle("*「 C O N S U L T A  D E  P L A C A 」*")
    //             .addFields(
    //                 {
    //                     name:"Marca",
    //                     value:`${dados.marca}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Modelo",
    //                     value:`${dados.modelo}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Ano de Fabricação",
    //                     value:`${dados.anoFabricacao}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Ano Modelo",
    //                     value:`${dados.anoModelo}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Cor",
    //                     value:`${dados.cor}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Cilindrada",
    //                     value:`${dados.cilindrada}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Potencia",
    //                     value:`${dados.potencia}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"combustivel",
    //                     value:`${dados.combustivel}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Chassi",
    //                     value:`${dados.chassi}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Estado",
    //                     value:`${dados.uf}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"municipio",
    //                     value:`${dados.municipio}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Importado?",
    //                     value:`${dados.importado}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Peso Bruto",
    //                     value:`${dados.pesoBrutoTotal}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Capacidade Tração",
    //                     value:`${dados.capMaxTracao}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"tipo de veiculo",
    //                     value:`${dados.tipoVeiculo}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Especie de Veiculo",
    //                     value:`${dados.especieVeiculo}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Quantia de Passageiros",
    //                     value:`${dados.passageiros}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Segmento",
    //                     value:`${dados.segmento}`,
    //                     inline:true
    //                 },
    //                 {
    //                     name:"Capacidade de Carga",
    //                     value:`${dados.capacidadeCarga}`,
    //                     inline:true
    //                 },
    //             )
    //         ] 
    //         }).then((msg) => {
    //         interaction.editReply({
    //         content:`Sua Consulta foi enviada com sucesso!, verifique sua dm: ${msg.url}`})
            
    //         }
    //         )

    //         }).catch(async (err) => {
    //         console.log(err)
    //         interaction.editReply({content: 'Placa não encontrada.', ephemeral:true})
    //         })
    //     }

    }}
