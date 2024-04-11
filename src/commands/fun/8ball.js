const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("ask me anything")
        .setMinLength(10)
        .setMaxLength(250)
    )
    .setDescription("give's a random answer")
    .addBooleanOption((option) =>
      option
        .setName("hidden")
        .setDescription(
          "whether or not to hide the response from the 8ball (displayed by default)"
        )
    ),
  async execute(interaction, client) {
    const { options, user } = await interaction;
    const questions = options.getString('question');
    const hidden = await options.getBoolean('hidden');
    let randomNum = Math.floor(Math.random(0, responses.length - 0.001));

    if(!questions.endsWith('?')) return interaction.reply({ ephemeral: true, content: 'Sentence must end with a "?"' });

    const embed = new EmbedBuilder()
        .setTitle('8-Ball')
        .setAuthor({ name: user.username, URL: user.displayAvatarURL() })
        .setColor('Random')
        .setDescription(questions)
        .addFields({
            name: 'response',
            value: responses[randomNum]
        });
    interaction.reply({ ephemeral: hidden, embeds: [embed] });
  },
};

const responses = [
  "It is certain.",

  "Without a doubt.",

  "You may rely on it.",

  "Yes, definitely.",

  "It is decidedly so.",

  "As I see it, yes.",

  "Most likely.",

  "Yes.",

  "Outlook good.",

  "Signs point to yes.",

  "Reply hazy, try again.",

  "Better not tell you now.",

  "Ask again later.",

  "Cannot predict now.",

  "Concentrate and ask again.",

  "Don't count on it.",

  "Outlook not so good.",

  "My sources say no.",

  "Very doubtful.",

  "My reply is no.",

  "No.",

  "Definitely not.",

  "No way.",

  "I highly doubt it.",

  "Absolutely not.",
];
