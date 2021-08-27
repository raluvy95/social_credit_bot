const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const jsyaml = require("js-yaml")
const fs = require("fs")

const configuration = jsyaml.load(fs.readFileSync('./config.yaml', 'utf8'))

/*
    This is the register slash commands.
    You can type '/' on the server and will show the list of commands avaliable.
*/

const commands = [
    new SlashCommandBuilder().setName('xp').setDescription('Show your social credit score!')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)),
    new SlashCommandBuilder().setName('top').setDescription("Show leaderboard"),
    new SlashCommandBuilder().setName('about').setDescription("Show information about our bot"),
    new SlashCommandBuilder().setName('add').setDescription("Adds score to specific user")
        .addUserOption(opt => opt.setName("user").setDescription("User to add score").setRequired(true))
        .addIntegerOption(opt => opt.setName("score").setDescription("Score to add").setRequired(true)),
    new SlashCommandBuilder().setName('remove').setDescription("Remove score from specific user")
        .addUserOption(opt => opt.setName("user").setDescription("User to remove score").setRequired(true))
        .addIntegerOption(opt => opt.setName("score").setDescription("Score to remove").setRequired(true)),
    new SlashCommandBuilder().setName("config").setDescription("Configure the bot in this server")
        .addSubcommand(slash =>
            slash.setName("slient").setDescription("Tell the bot to stop sending +15/-15 social credit.")
                .addBooleanOption(opt => opt.setName("value").setDescription("Value boolean.").setRequired(false))
        )
        .addSubcommand(slash =>
            slash.setName("cooldown").setDescription("Cooldown to add +5/-5 social credit")
                .addIntegerOption(opt => opt.setName("value").setDescription("Seconds").setRequired(true))
        )
        .addSubcommand(slash => slash.setName("points").setDescription("Points to add social credit.")
            .addIntegerOption(opt => opt.setName("value").setDescription("Points").setRequired(true)))
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(configuration.token);
(async () => {
    try {
        await rest.put(
            configuration.guildSlashOnly ?
            Routes.applicationGuildCommands(configuration.clientID, configuration.guildID) :
            Routes.applicationCommands(configuration.clientID),
            { body: commands },
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();

