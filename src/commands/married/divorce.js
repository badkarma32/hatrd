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
    .setName("divorce")
    .setDescription("Divorce your partner"),
  async execute(interaction, client) {
    const intUser = interaction.user;
    const userData = await schema.findOne({ marriedUser: intUser.id });
    if (!userData) {
      await interaction.reply({
        content: "You aren't married to anybody yet!",
        ephemeral: true,
      });
    } else {
      const marriedToID = userData.marriedTo;
      const embed = new EmbedBuilder()
        .setColor("DarkVividPink")
        .setTitle("Are you sure?")
        .setDescription(
          `${intUser}, are you sure you want to divorce <@${marriedToID}>? You can only re-marry if they accept.`
        );
      const yes = new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success);
      const no = new ButtonBuilder()
        .setCustomId("no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger);
      const row = new ActionRowBuilder().addComponents(yes, no);
      const msg = await interaction.reply({
        embeds: [embed],
        components: [row],
      });
      const collector = msg.createMessageComponentCollector();
      collector.on("collect", async (i) => {
        if (!i.isButton()) return;
        if (i.user.id !== interaction.user.id) return await i.deferUpdate();
        if (i.customId === "yes") {
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("You're single!")
            .setDescription(
              `You divorced <@${marriedToID}> and now you're single! congratulations!`
            );
          yes.setDisabled(true);
          no.setDisabled(true);

          await schema.findOneAndDelete({ marriedUser: marriedToID });
          await schema.findOneAndDelete({
            marriedUser: interaction.user.id,
          });

          await i.deferUpdate();
          await interaction.editReply({ embeds: [embed], components: [row] });
        }

        if (i.customId === "no") {
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Your choice 🤷")
            .setDescription(
              `You decided not to divorce <@${marriedToID}>, nice..?`
            );
          yes.setDisabled(true);
          no.setDisabled(true);

          await i.deferUpdate();
          await interaction.editReply({ embeds: [embed], components: [row] });
        }
      });
    }
  },
};
