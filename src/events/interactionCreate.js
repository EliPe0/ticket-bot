const discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;   
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '🟥 | Ocorreu um erro ao executar esse comando!', flags: discord.MessageFlags.Ephemeral });
            }
    } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'config-modal') {
                const sendChannelId = interaction.fields.getTextInputValue('send-channel-input');
                const categoryChannelId = interaction.fields.getTextInputValue('category-channel-input');
                const supportRoleId = interaction.fields.getTextInputValue('support-role-input');
                fs.writeFileSync(path.join(__dirname, '..', 'config', 'config.json'), JSON.stringify({
                    sendChannelId: sendChannelId,
                    categoryChannelId: categoryChannelId,
                    supportRoleId: supportRoleId
                }, null, 2));
                await interaction.reply({ content: '✅ | Configurações salvas com sucesso!', flags: discord.MessageFlags.Ephemeral });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'create-ticket') {
                const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config', 'config.json')));
                const category = await interaction.guild.channels.fetch(config.categoryChannelId);
                const supportRole = await interaction.guild.roles.fetch(config.supportRoleId);
                const channelName = `ticket-${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`;
                const ticketChannel = await interaction.guild.channels.create({
                    name: channelName,
                    type: discord.ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [discord.PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [discord.PermissionsBitField.Flags.ViewChannel, discord.PermissionsBitField.Flags.SendMessages],
                        },
                        {   
                            id: supportRole.id,
                            allow: [discord.PermissionsBitField.Flags.ViewChannel, discord.PermissionsBitField.Flags.SendMessages],
                        },
                    ],
                });
                const embed = new discord.EmbedBuilder()
                    .setTitle('🎟️ | Suporte')
                    .setDescription('Obrigado por entrar em contato com o suporte! Em breve, um membro da nossa equipe irá te ajudar.')
                    .setColor(discord.Colors.Green);

                const closeButton = new discord.ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Fechar Ticket')
                    .setEmoji('🔒')
                    .setStyle(discord.ButtonStyle.Danger);
                const row = new discord.ActionRowBuilder().addComponents(closeButton);

                await ticketChannel.send({ content: `${interaction.user}, seja bem-vindo ao seu ticket de suporte!`, embeds: [embed], components: [row] });
                await interaction.reply({ content: `✅ | Seu ticket foi criado: ${ticketChannel}`, flags: discord.MessageFlags.Ephemeral });
            } else if (interaction.customId === 'close-ticket') {

                interaction.reply({ content: '🔒 | O ticket será fechado em 5 segundos...', flags: discord.MessageFlags.Ephemeral });
                setTimeout(async () => {
                    await interaction.channel.delete();
                }, 5000);
            }
        }
    }   
};
