const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescription("kicks a member from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("the member you would like to kick")
        .setRequired(true)
    )
    .addStringOption((option) => 
        option
            .setName('reason')
            .setDescription('the reason for kicking this member')
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser('target');
    let reason = interaction.options.getString('reason');
    const member = await interaction.guild.members
        .fetch(user.id)
        .catch(console.error);

    if (!reason) reason = 'no reason';

    await user.send({
        content: `You have been kicked from ${interaction.guild.name}\nReason: ${reason}`
    })

    await member.kick(reason).catch(console.error);

    await interaction.reply({
        content: `${user.tag} has been kicked.`
    });
  },
};
