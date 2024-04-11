const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("show's a meme"),
  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });

    try {
      const response = await axios.get("https://reddit.com/r/memes/random/.json", {
        timeout: 10000,
      });
      const data = response.data[0].data.children[0].data
      
      const memeEmbed = new EmbedBuilder()
        .setTitle(`${data.title}`)
        .setURL(`https://reddit.com${data.permalink}`)
        .setTimestamp()
        .setColor("Random")
        .setDescription(
          `
                    ${data.author}\n${data.selftext}
                `
        )
        .setFooter({
          text: `👍 ${data.ups} | 💬 ${data.num_comments}`,
        });

      await interaction.editReply({ embeds: [memeEmbed] });
    } catch (error) {
      await interaction.editReply({
        content: `Their Was An Error While Getting Advice From API, Try Again Later`,
        ephemeral: true,
      });
      await wait(6000);
      await interaction.deleteReply();
      console.log(error);
    }
  },
};
