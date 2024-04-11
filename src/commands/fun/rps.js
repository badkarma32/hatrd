const { SlashCommandBuilder } = require("discord.js");
const { RockPaperScissors } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("the person you're playing against")
        .setRequired(true)
    )
    .setDescription("play rock paper scissors"),
  async execute(interaction, client) {

    const { options } = interaction;
    const opponent = options.getUser('opponent');

    const Game = new RockPaperScissors({
        message: interaction,
        isSlashGame: true,
        opponent: opponent,
        embed: {
            title: 'rock paper scissors',
            color: '#5865F2',
            description: 'press a button below to make a choice'
        },
        buttons: {
            rock: 'rock',
            paper: 'paper',
            scissors: 'scissors'
        },
        emojis: {
            rock: '🪨',
            paper: '📃',
            scissors: '✂️'
        },
        mentionUser: true,
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        pickMessage: 'you choose {emoji}',
        winMessage: '**${player}** won the game! congratulations!',
        tieMessage: 'the game tied! no one won the game.',
        timeoutMessage: 'the game went unfinished! no one won the game.',
        playerOnlyMessage: 'only {player} and {opponent} can use these buttons.'
    });

    Game.startGame();
  },
};
