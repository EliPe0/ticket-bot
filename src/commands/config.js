const discord = require('discord.js');
const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data : new discord.SlashCommandBuilder()
        .setName('config')
        .setDescription('Configurações do bot!'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('config-modal')
            .setTitle('Configurações do Bot');

        const sendChannel = new TextInputBuilder()
            .setCustomId('send-channel-input')
            .setLabel('Canal de Envio')
            .setStyle(discord.TextInputStyle.Short)
            .setPlaceholder('Digite o ID do canal de envio')
            .setRequired(true);

        const categoryChannel = new TextInputBuilder()
            .setCustomId('category-channel-input')
            .setLabel('Categoria dos Canais')
            .setStyle(discord.TextInputStyle.Short)
            .setPlaceholder('Digite o ID da categoria para os canais')
            .setRequired(true);

        const suportRole = new TextInputBuilder()
            .setCustomId('support-role-input')
            .setLabel('Cargo de Suporte')
            .setStyle(discord.TextInputStyle.Short)
            .setPlaceholder('Digite o ID do cargo de suporte')
            .setRequired(true);

        const actionRow1 = new ActionRowBuilder().addComponents(sendChannel);
        const actionRow2 = new ActionRowBuilder().addComponents(categoryChannel);
        const actionRow3 = new ActionRowBuilder().addComponents(suportRole);
        modal.addComponents(actionRow1, actionRow2, actionRow3);

        await interaction.showModal(modal);
    }
}