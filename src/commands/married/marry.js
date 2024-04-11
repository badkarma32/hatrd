const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const schema = require("../../schemas/marriage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("Marry somebody")
    .addUserOption((opt) =>
      opt
        .setName("person")
        .setDescription("The person you want to marry")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("person");
    if (user.bot)
      return await interaction.reply({
        content: "You cannot marry a bot?! weirdo!",
        ephemeral: true,
      });
    if (interaction.user.id === user.id)
      return await interaction.reply({
        content: "You can't marry yourself! Silly goose!",
        ephemeral: true,
      });
    const intUser = interaction.user;
    const intUserData = await schema.findOne({
      marriedUser: intUser.id,
    });
    const userData = await schema.findOne({ marriedUser: user.id });
    if (!intUserData) {
      if (!userData) {
        const embed = new EmbedBuilder()
          .setColor("DarkVividPink")
          .setTitle(`Do they accept?`)
          .setDescription(
            `${intUser} Wants to marry you! Do you accept their proposal?`
          );

        const accept = new ButtonBuilder()
          .setCustomId("accept")
          .setLabel("I do")
          .setStyle(ButtonStyle.Success);

        const deny = new ButtonBuilder()
          .setCustomId("no")
          .setLabel("I don't")
          .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(accept, deny);
        const msg = await interaction.reply({
          content: `${user}`,
          allowedMentions: {
            parse: ["users"],
          },
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });
        const collector = msg.createMessageComponentCollector();
        collector.on("collect", async (i) => {
          if (i.user.id !== user.id)
            return await i.reply({
              content: `Only ${user} can use these buttons!`,
            });
          if (i.customId === "accept") {
            embed
              .setColor("Green")
              .setTitle("Congratulations! 🎉")
              .setDescription(`${intUser} and ${user} are officially married!`);

            accept.setDisabled(true);
            deny.setDisabled(true);

            await schema.create({
              marriedUser: user.id,
              marriedTo: intUser.id,
            });
            await schema.create({
              marriedUser: intUser.id,
              marriedTo: user.id,
            });

            await i.deferUpdate();
            await interaction.editReply({
              embeds: [embed],
              content: null,
              components: [row],
            });
          }
          if (i.customId === "no") {
            embed
              .setColor("Red")
              .setTitle("😔")
              .setDescription(`${user} Did not want to marry you!`);

            accept.setDisabled(true);
            deny.setDisabled(true);

            await i.deferUpdate();
            await interaction.editReply({
              embeds: [embed],
              content: null,
              components: [row],
            });
          }
        });
      } else {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("This person is already married!");

        await interaction.reply({ embeds: [embed] });
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("You're already married!");

      await interaction.reply({ embeds: [embed] });
    }
  },
};
