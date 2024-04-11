const { Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "button",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { buttons, config } = client;
    const { customId } = interaction;
    const button = buttons.get(customId);
    if (!button) return;
    try {
      await button.execute(interaction, client);
    } catch (err) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.errorColor)
            .setTitle("An error occured!")
            .setDescription(`Please report this error: \`\`\`js\n${err}\`\`\``),
        ],
        ephemeral: true,
      });
      console.error(err);
    }
  },
};
