const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const notes = require('../../schemas/releasenotes');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('release-notes')
        .setDescription('Bot Updates')
        .addSubcommand(command => command.setName('view').setDescription('view the most recent release notes'))
        .addSubcommand(command => command.setName('publish').setDescription('add new release notes (developer only)').addStringOption(option => option.setName('updated-notes').setDescription('the notes to publish').setRequired(true))),
    async execute (interaction) {
        const { options } = interaction;
        const sub = options.getSubcommand();
        var data = await notes.find();

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: false });
        }

        async function updateNotes(update, version) {
            await notes.create({
                Updates: update,
                Date: Date.now(),
                Developer: interaction.user.username,
                Version: version
            });

            await sendMessage('i have updated your release notes');
        }

        switch (sub) {
            case 'publish':
                if (interaction.user.id !== '791757304797331466') {
                    await sendMessage('sorry! only developers can run this command');
                } else {
                    const update = options.getString('updated-notes');
                    if (data.length > 0) {
                        await notes.deleteMany();

                        var version = 0;
                        await data.forEach(async value => {
                            version += value.Version;
                        });

                        await updateNotes(update, version+0.1);
                    } else {
                        await updateNotes(update, 1.0);
                    }
                }
            break;
            case 'view':
                if (data.length == 0) {
                    await sendMessage('there is no public release notes yet..');
                } else {
                    var string = ``;
                    await data.forEach(async value => {
                        string += `\`${value.Version}\` \n\n**Update Information:**\n\`\`\`${value.Updates}\`\`\`\n\n**Updating Developer:** ${value.Developer}\n**Update Date:** <t:${Math.floor(value.Date / 1000)}:R>`
                    });

                    await sendMessage(`**Release Notes** ${string}`)
                }
        }
    }
}