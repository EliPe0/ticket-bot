const discord = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    
        async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Ocorreu um erro ao executar esse comando!', flags: discord.MessageFlags.Ephemeral });
        }
    }

}