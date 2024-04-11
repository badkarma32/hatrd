const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { hexCheck } = require('tech-tip-cyber')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrole')
        .setDescription('Create A Role In Server')  
        
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name Of Role You Want To Create')
                .setRequired(true))
        
        .addStringOption(option =>
            option
                .setName('color')
                .setDescription('Color Of Role')
                .setRequired(true))
        
        .addNumberOption(option =>
            option
                .setName('position')
                .setDescription('Position Of Role')
                .setRequired(true))
        
        .addStringOption(option =>
            option
                .setName('mention')
                .setDescription('Should The Role Be Mention By Everyone Or Not')
                .addChoices(
                    { name: 'Yes', value: 'true' },
                    { name: 'No', value: 'false' }
                )
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction, client) {
        const name = interaction.options.getString('name') 
        const position = interaction.options.getNumber('position') 
        const mention = interaction.options.getString('mention') 
        let color = interaction.options.getString('color') 

        const part1 = color.slice(0, 1) 
        const part2 = color.slice(1, 2) 
        const part3 = color.slice(2, 3) 

        if (color.length > 6 || color.length < 3 || color.length === 1 || color.length === 2 || color.length === 4 || color.length === 5) return await interaction.reply({ content: `Color Hex Code Can't Be More Than 6 Digits Or Less Than 3 Digits`, ephemeral: true }) // If Hex Code Is Wrong
        if (color.length === 3) color = `${part1}${part1}${part2}${part2}${part3}${part3}`
        const checkColor = hexCheck().test(`#${color}`) 
        if (checkColor === false) return await interaction.reply({ content: `Color Hex Code Isn't Correct`, ephemeral: true }) 

        const CreateRoleembed = new EmbedBuilder()
            .setTitle('Create Role')
            .setDescription(`You Wanted To Create A Role Named ${name} With Color #${color}`)
            .setColor('Random')

        const CreateRoleSuccessembed = new EmbedBuilder()
            .setTitle('Created Role')
            .setDescription(`You Created A Role Named ${name} With Color #${color}`)
            .setColor('Green')

        const buttons = new ActionRowBuilder()
            .addComponents( 
                new ButtonBuilder()
                    .setLabel('Yes')
                    .setCustomId('yes')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel('No')
                    .setCustomId('no')
                    .setStyle(ButtonStyle.Danger)
            )

        const msg = await interaction.reply({ embeds: [CreateRoleembed], components: [buttons], fetchReply: true })

        
        const collector = msg.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 40000 
        })

        collector.on('collect', async i => {
            const id = i.customId
            const value = id

            if (value === 'yes') { 
                await interaction.followUp({ content: `Successfully Created A Role With Name **${name}**` })
                interaction.guild.roles.create({ 
                    name: name, 
                    color: color, 
                    position: position, 
                    mentionable: mention, 
                    permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageChannels]  // Permissions Of Role // You Can Keep Any Permissions Which You Want
                })
                collector.stop()
                i.update({ content: `Interaction Completed`, embeds: [CreateRoleSuccessembed], components: [] })
            } else if (value === 'no') { 
                await interaction.followUp({ content: `Cancelled`, ephemeral: true })
                collector.stop()
                i.update({ content: `Interaction Completed`, embeds: [CreateRoleembed], components: [] })
            }
        })

        collector.on('end', async collected => { 
            await interaction.editReply({ content: `Buttons Not Used In Time`, embeds: [CreateRoleembed], components: [] })
            collector.stop()
        })

    }
}