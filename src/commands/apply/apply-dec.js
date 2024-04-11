const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('app-dec')
        .setDescription('staff app gets declined')
        .addUserOption(option => option.setName('username').setDescription('The applicants username').setRequired(true))
        .addStringOption(option => option.setName('position').setDescription('The position that was decided for the applicant').setRequired(true).addChoices(
            { name: 'admin', value: 'admin' },
            { name: 'mod', value: 'mod' },
            { name: 'partnership manager', value: 'partnershop manager' },
            { name: 'pfp uploader', value: 'pfp uploader' },
        )),

    async execute(interaction, client) {
        let position = interaction.options.getString('position')
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "You must Be in the /hatrd staff team to be able to use this command!", ephemeral: true });
        const channel = client.channels.cache.get('1228040013439307899');
        const user = interaction.options.getUser('username')
        const accembed = new EmbedBuilder()
            .setTitle(":x: Application Declined!")
            .setDescription(`${user}'s application has been succesfully declined!`)
            .setTimestamp()
        const accembeduser = new EmbedBuilder()
            .setTitle(`You were declined in /hatrd's application`)
            .setDescription(`Hello ${user} sorry to say that but your submitted application to be a ${position} was declined. \n Feel free to apply at any time!`)
            .setTimestamp()
            await interaction.reply({ embeds: [accembed] })

        user.send({ embeds: [accembeduser] })


    }

} 