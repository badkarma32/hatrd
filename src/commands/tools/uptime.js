const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime') 
        .setDescription('Get UpTime Of Bot'),
    async execute(interaction, client) {

        const days = Math.floor(client.uptime / 86400000)
        const hours = Math.floor(client.uptime / 3600000) % 24
        const minutes = Math.floor(client.uptime / 60000) % 60
        const seconds = Math.floor(client.uptime / 1000) % 60

        const uptimeEmbed = new EmbedBuilder()
            .setAuthor({
                name: `UpTime Of ${client.user.username}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setColor('Random')
            .setDescription(`UpTime Of ${client.user.username} Is \n\`${days}\` Days \`${hours}\` Hours \`${minutes}\` Minutes \`${seconds}\` Seconds`)
            .setFooter({
                text: `UpTime`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp()

        await interaction.deferReply({ fetchReply: true })
        await interaction.editReply({ embeds: [uptimeEmbed] })

    }
}