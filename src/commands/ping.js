const discord = require('discord.js');

module.exports = {
    data : new discord.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde com Pong!'),

    async execute(interaction) {
        await interaction.reply({ content: '🏓 Pong!', flags: discord.MessageFlags.Ephemeral });
    }
}