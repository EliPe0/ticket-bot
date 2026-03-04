require('dotenv').config({quiet: true});

const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const fs = require('fs');
const path = require('path');

const commandFiles = fs.readdirSync(path.join(__dirname, '..', '..', 'src', 'commands')).filter(file => file.endsWith('.js'));
const commands = [];
for (const file of commandFiles) {
    const command = require(path.join(__dirname, '..', '..', 'src', 'commands', file));
    commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log(`🚀 | Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log(`✅ | Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();