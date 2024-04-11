const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events } = require('discord.js')
const repSchema = require('../../schemas/reps');
const { slashPaginate } = require('embed-pagination.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rep')
    .setDescription("Rep commands")
    .addSubcommand(sc => sc
        .setName('view')
        .setDescription("View a member's reps")
        .addUserOption(o => o.setName("member").setDescription("The member who's reps you want to view").setRequired(true)))
    .addSubcommand(sc => sc
        .setName("member")
        .setDescription("Rep a member")
        .addUserOption(o => o.setName("member").setDescription("The member you want to rep").setRequired(true))
        .addNumberOption(o => o.setName("rating").setDescription("What do you rate this user from 1-5?").setMinValue(1).setMaxValue(5).setRequired(true))
        .addStringOption(o => o.setName("message").setDescription("(optional) Message you want to be associated with your rep").setRequired(false)))
    .addSubcommand(sc => sc
        .setName("leaderboard")
        .setDescription("See the server leaderboard for reps")),
    
    async execute (interaction, client) {
        const { options, guild } = interaction;
        const sub = options.getSubcommand();
        const member = options.getUser('member');

        if (sub == 'view') {
            const data = await repSchema.findOne({ guildId: guild.id, userId: member.id });
            if (!data) {
                const embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle(`${member.username}'s Reps`)
                .setThumbnail(member.displayAvatarURL({dynamic: true}))
                .addFields(
                    { name: "Total:", value: `**0**`},
                    { name: "Last Rep:", value: `**By:** ...\n**Rating:** ...\n**Message:** ...\n**Time:** ...`}
                )
                return await interaction.reply({ embeds: [embed] })
            }
            
            const total = data.totalReps;
            const { by, msg, time, rating } = data.latestRep;
            const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle(`${member.username}'s Reps`)
            .setThumbnail(member.displayAvatarURL({dynamic: true}))
            .addFields(
                { name: "Total:", value: `**${total}**`},
                { name: "Last Rep:", value: `**By:** <@${by}>\n**Rating:** ${'⭐'.repeat(Math.round(rating)) ?? "..."}\n**Message:** ${msg}\n**Time:** <t:${Math.floor(time/1000)}:R>`}
            )
            const row = new ActionRowBuilder()

            const btn = new ButtonBuilder()
            .setCustomId("view_allreps")
            .setLabel("View All Reps")
            .setStyle(ButtonStyle.Primary)
            row.setComponents(btn)

            await interaction.reply({ embeds: [embed], components: [row] });
        } else if (sub == 'member') {
            let member = options.getUser('member');
            const timeNow = Date.now();
            const rating = options.getNumber('rating') ?? 5
            const message = options.getString('message') || '...';
            const { user } = interaction;
            const data = await repSchema.findOne({ guildId: guild.id, userId: member.id });
            if (!data) {
                await repSchema.create({
                    guildId: guild.id,
                    userId: member.id,
                    latestRep: {
                        by: user.id,
                        msg: message,
                        time: timeNow
                    },
                    averageRating: rating,
                    totalReps: 1,
                    reps: [
                        {
                            by: user.id,
                            msg: message,
                            rating: rating,
                            time: timeNow
                        }
                    ]
                })

                const embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle("Successfully Repped")
                .setDescription(`${member} now has 1 rep!\n**Rating:** ${'⭐'.repeat(Math.round(rating))}\n**Message:** ${message}\n**Time:** <t:${Math.floor(timeNow/1000)}:R>`)
                .setThumbnail(member.displayAvatarURL({dynamic:true}))
                return await interaction.reply({ embeds: [embed] })
            }
            const allReps = data.reps
            let sum = 0+rating;
            let amnt = 1;
            for (let rep of data.reps) {
                sum+=rep.rating ?? 0;
                amnt++;
            }
            const avg = findAverage(sum, data.reps.length+1)
            console.log(avg)
            console.log(sum)
            console.log(amnt)

            const newData = await repSchema.findOneAndUpdate({ guildId: guild.id, userId: member.id }, 
            {
                averageRating: avg,
                totalReps: data.totalReps + 1,
                latestRep: {
                    by: user.id,
                    msg: message,
                    rating: rating,
                    time: timeNow
                },
                $push: {
                    reps: {
                        by: user.id,
                        msg: message,
                        rating: rating,
                        time: timeNow
                    }
                }
            });

            const embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle("Successfully Repped")
                .setDescription(`${member} now has ${newData.totalReps+1} rep(s)!\n**Rating:** ${'⭐'.repeat(Math.round(rating))}\n**Message:** ${message}\n**Time:** <t:${Math.floor(timeNow/1000)}:R>`)
                .setThumbnail(member.displayAvatarURL({dynamic:true}))
                await interaction.reply({ embeds: [embed] })
        } else if (sub == 'leaderboard') {
            const { user } = interaction;
            let data = await repSchema.find({ guildId: guild.id }).sort({ totalReps: -1 })
            data = data.slice(0, 10);
            let desc = ``;
            let footer = `You are not on the leaderboard (0 reps)`;

            for (let user of data) {
                const indx = data.indexOf(user);
                let stars = `⭐`.repeat(Math.round(user.averageRating));
                if (stars.length <= 0) stars = "... No rating"
                const reps = user.totalReps;
                const userid = user.userId;
                if (indx == 0) desc += `\n**🥇)** <@${userid}> - \`${reps} Rep(s)\` **(${stars})**`
                else if (indx == 1) desc += `\n**🥈)** <@${userid}> - \`${reps} Rep(s)\` **(${stars})**`
                else if (indx == 2) desc += `\n**🥉)** <@${userid}> - \`${reps} Rep(s)\` **(${stars})**`
                else desc += `\n**${indx+1})** <@${userid}> - \`${reps} Rep(s)\` **(${stars})**`
            }
            for (let user of data) {
                const indx = data.indexOf(user)
                if (user.userId == interaction.user.id) {
                    footer = `You are in #${indx+1} place`;
                    break;
                }
            }

            const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle(`${interaction.guild.name ?? "Server"} Rep Leaderboard`)
            .setDescription(desc)
            .setFooter({ text: footer })

            await interaction.reply({ embeds: [embed] })
        }

        //events

        client.on(Events.InteractionCreate, async i => {
            if (i.isButton()) {
                if (i.customId == 'view_allreps') {
                    const data = await repSchema.findOne({ guildId: i.guild.id, userId: member.id })
                    if (!data) return await i.reply({ content: "This user does not have any reps", ephemeral: true });

                    const allReps = data.reps;
                    const pages = [];
                    for (let rep of allReps) {
                        const i = allReps.indexOf(rep);
                        const by = rep.by;
                        const msg = rep.msg;
                        const rating  = rep.rating
                        const time = rep.time;
                        const embed = new EmbedBuilder()
                        .setColor("Purple")
                        .setTitle(`Rep (${i+1})`)
                        .setDescription(`\n**By:** <@${by}>\n**Rating:** ${'⭐'.repeat(Math.round(rating )) ?? "..." }\n**Message:** ${msg}\n**Time:** <t:${Math.floor(time/1000)}:R>`)
                        pages.push(embed.toJSON())
                    }
                    return await slashPaginate({
                        interaction: i,
                        pages: pages,
                        ephemeral: true,
                        disable: {
                            beginning: true,
                            placeholder: true,
                            end: true
                        }
                    })
                }
            }
        })
    }
}

function findAverage(sum, totalNums) {
    return sum/totalNums;
}