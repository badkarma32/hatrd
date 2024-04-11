const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const schema = require("../../schemas/marriage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("relationships")
    .setDescription("See who a user is married to, if they're married at all")
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("User you're checking")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const data = await schema.findOne({ marriedUser: user.id });
    if (!data) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`${user} isn't married to anybody!`);

      await interaction.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`${user} is married to <@${data.marriedTo}>`);

      await interaction.reply({ embeds: [embed] });
    }
  },
};
