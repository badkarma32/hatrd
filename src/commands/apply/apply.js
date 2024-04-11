const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apply')
        .setDescription('apply for staff!')
        .addUserOption(option => option.setName('username').setDescription('Your discord username').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The Reason you want to apply?').setRequired(true))
        .addNumberOption(option => option.setName('age').setDescription('Your age').setRequired(true))
        .addStringOption(option => option.setName('position').setDescription('The position you are applying for').setRequired(true).addChoices(
            { name: 'admin', value: 'admin' },
            { name: 'mod', value: 'mod' },
            { name: 'partnership manager', value: 'partnershop manager' },
            { name: 'pfp uploader', value: 'pfp uploader' },
        ))
        .addStringOption(option => option.setName('experience').setDescription('Tell us if you have had any experience like this before!').setRequired(true))

    ,

    async execute(interaction, client) {


        const channel = client.channels.cache.get('1228040013439307899');
        const user = interaction.options.getUser('user') || interaction.user;
        let reason = interaction.options.getString('reason');
        let age = interaction.options.getNumber('age')
        let position = interaction.options.getString('position')
        let experiencce = interaction.options.getString('experience')
        const icon = user.displayAvatarURL();
        const tag = user.tag;
        const member = await interaction.guild.members.fetch(user.id);
        if (age <= 11) return await interaction.reply({ content: "You must be atleast 13 years old to apply for /hatrd", ephemeral: true })
        if (age >= 37) return await interaction.reply({ content: "You are too old to apply for /hatrd", ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle('/hatrd staff applications')
            .setAuthor({ name: tag, iconURL: icon })
            .setThumbnail(icon)
            .setDescription(`**Reason:** ${reason} \n \n **Age:** ${age} \n \n **Applied position:** ${position} \n \n **Experience:** ${experiencce}`)
            .setFooter({ text: `User ID: ${user.id}`, inline: false })
            .addFields({ name: "Joined /hatrd", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: false })
            .setTimestamp()

        await channel.send({ embeds: [embed] })
        user.send(`Hello <@${user.id}> your application has been succesfully sent to /hatrd staff team! Good luck!`)

        await interaction.reply({ content: `:white_check_mark: Thanks for applying your application was sent to our team! the results will be announced to you shortly`, ephemeral: true })
    }
}