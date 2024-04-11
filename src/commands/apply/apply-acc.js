const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('app-accept')
        .setDescription('staff app gets accepted')
        .addUserOption(option => option.setName('username').setDescription('The applicants username').setRequired(true))
        .addStringOption(option => option.setName('position').setDescription('The position that is decided for the applicant').setRequired(true).addChoices(
            { name: 'admin', value: 'admin' },
            { name: 'mod', value: 'mod' },
            { name: 'partnership manager', value: 'partnershop manager' },
            { name: 'pfp uploader', value: 'pfp uploader' },
        )),

    async execute(interaction, client) {
        let position = interaction.options.getString('position')
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "You must Be in the RAY staff team to be able to use this command!", ephemeral: true });
        const channel = client.channels.cache.get('1228040013439307899');
        const user = interaction.options.getUser('username')
        const accembed = new EmbedBuilder()
            .setTitle(":white_check_mark: Application Accepted!")
            .setDescription(`${user}'s application has been succesfully accepted and they are now a part of /hatrd's team!`)
            .setTimestamp()
            const accembeduser = new EmbedBuilder()
            .setTitle(`You were accepted in /hatrd applications`)
            .setDescription(`Hello ${user} You are now a part of the /hatrd staff team as a ${position}`)
            .setTimestamp()
        await interaction.reply({ embeds: [accembed] })

        user.send({ embeds: [accembeduser] })


    }

}