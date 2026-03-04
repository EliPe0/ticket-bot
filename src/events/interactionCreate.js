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
        }
     }
};
