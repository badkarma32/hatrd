const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const os = require('os')
const moment = require('moment')
const cpuStat = require('cpu-stat')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Get Info Of Bot'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({ fetchReply: true })

        const days = Math.floor(client.uptime / 86400000)
        const hours = Math.floor(client.uptime / 3600000) % 24
        const minutes = Math.floor(client.uptime / 60000) % 60
        const seconds = Math.floor(client.uptime / 1000) % 60

        const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        cpuStat.usagePercent(async function (error, percent) {
            if (error) return console.log(error)

            const node = process.version
            const memoryUsage = formatBytes(process.memoryUsage().heapUsed)
            const CPU = percent.toFixed(2)
            const CPUModel = os.cpus()[0].model
            const cores = os.cpus().length

            const botinfoEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `Bot Info`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({
                    text: `Bot Info`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor('Random')
                .addFields(
                    { name: `**Bot Name:**`, value: `${client.user.username}`, inline: true },
                    { name: `**Bot ID:**`, value: `${client.user.id}`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    { name: `**Bot Created At:**`, value: `${moment.utc(client.user.createdAt).format('LLLL')}`, inline: true },
                    { name: `**Bot Joined At:**`, value: `${moment.utc(client.joinedAt).format('LLLL')}`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    { name: `**Total Server:**`, value: `${client.guilds.cache.size}`, inline: true },
                    { name: `**Total Members:**`, value: `${totalUsers}`, inline: true },
                    { name: `**Total Channels:**`, value: `${client.channels.cache.size.toLocaleString()}`, inline: true },
                    { name: `**UpTime:**`, value: `\`${days}\` Days \`${hours}\` Hours \`${minutes}\` Minutes \`${seconds}\` Seconds`, inline: true },
                    { name: `**Ping:**`, value: `API Latecy: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    { name: `**NodeJS Version:**`, value: `${node}`, inline: true },
                    { name: `**Memory Usage:**`, value: `${memoryUsage}`, inline: true },
                    { name: `**CPU Usage:**`, value: `${CPU}`, inline: true },
                    { name: `**CPU Model:**`, value: `${CPUModel}`, inline: true },
                    { name: `**Cores:**`, value: `${cores}`, inline: true },
                )
            await interaction.editReply({ embeds: [botinfoEmbed] })
        })

        
        function formatBytes(a, b) {
            let c = 1024
            d = b || 2
            e = ['B', 'KB', 'MB', 'GB', 'TB']
            f = Math.floor(Math.log(a) / Math.log(c))

            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
        }

    }
}