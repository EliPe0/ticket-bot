const discord = require('discord.js');
const fs = require('fs');
const path = require('path');


module.exports = {
    data : new discord.SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configurações do bot!'),

    async execute(interaction) {
        const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config', 'config.json')));
        const embed = new discord.EmbedBuilder()
            .setTitle('🎟️ | Suporte')
            .setDescription('Clique no botão abaixo para criar um ticket de suporte!')
            .setColor(discord.Colors.Blue);

        const button = new discord.ButtonBuilder()
            .setCustomId('create-ticket')
            .setLabel('Criar Ticket')
            .setEmoji('📩')
            .setStyle(discord.ButtonStyle.Primary);
        const row = new discord.ActionRowBuilder().addComponents(button);

        const sendChannel = await interaction.client.channels.fetch(config.sendChannelId);
        await sendChannel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: '✅ | Mensagem de suporte enviada com sucesso!', flags: discord.MessageFlags.Ephemeral });
    }
}