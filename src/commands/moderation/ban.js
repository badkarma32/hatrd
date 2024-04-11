const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("bans a member from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("the member you would like to ban")
        .setRequired(true)
    )
    .addStringOption((option) => 
        option
            .setName('reason')
            .setDescription('the reason for banning this member')
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser('target');
    let reason = interaction.options.getString('reason');
    const member = await interaction.guild.members
        .fetch(user.id)
        .catch(console.error);

    if (!reason) reason = 'no reason';

    await member
        .ban({
            days: 1,
            deleteMessage: 1,
            reason: reason,
        })
        .catch(console.error);

    await user.send({
        content: `You have been banned from ${interaction.guild.name}\nReason: ${reason}`
    })

    await interaction.reply({
        content: `${user.tag} has been banned.`
    });
  },
};
