const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("get's info on the specified user")
    .addUserOption(option =>
      option.setName("user").setDescription("User you have to get info of")
    ),
  async execute(interaction, client) {
    const member = interaction.options.getMember('user') || interaction.member;

    const userinfoEmbed = new EmbedBuilder()
    .setColor('Random')
    .setAuthor({
        name: `${member.user.username}'s Info`,
        iconURL: member.user.displayAvatarURL()
    })
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
    .addFields(
        {name: `**User Name:**`, value: `${member.user.username}#${member.user.discriminator}`, inline: true},
        {name: `**User ID:**`, value: member.user.id, inline: true},
        {name: `\u200B`, value: `\u200B`, inline: true},
        {name: `**Discord Created**:`, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true},
        {name: `**Joined Server**:`, value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true},
        {name: `**Roles:**`, value: `${member.roles.cache.map(role => role.toString())}`},
    )
    .setFooter({ text: `${member.user.username}'s Info` })

        await interaction.deferReply({ fetchReply: true })
        await interaction.editReply({ embeds: [userinfoEmbed] })
  },
};
