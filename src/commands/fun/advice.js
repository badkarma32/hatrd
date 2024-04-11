const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); 
const axios = require('axios'); 
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('advice') 
        .setDescription('Get Random Advice'),
    async execute(interaction, client) {

        await interaction.deferReply({ fetchReply: true }) 

        const data = await axios('https://api.adviceslip.com/advice') 

        try {
            const adviceEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `Advice`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp()
                .setColor('Random')
                .setDescription(`
Advice For You:
${data.data.slip.advice}
            `)

            await interaction.editReply({ embeds: [adviceEmbed] })
        } catch (error) { 
            await interaction.editReply({ content: `Their Was An Error While Getting Advice From API, Try Again Later`, ephemeral: true })
            await wait(6000)
            await interaction.deleteReply()
            console.log(error)
        }
    }
}