module.exports = {
    name: "top",
    async run(i, client) {
        const users = client.XP.all()
        const e = new client.Embed()
            .setTitle("Leaderboard - Top 10 most civilized users")
            .setColor("RANDOM")
        let c = 1;
        async function getUserName(snowflake) {
            const user = await client.users.fetch(snowflake, { cache: false })
            return `${user.username}#${user.discriminator}`
        }
        for (const user of users.sort((a, b) => b.data.xp + b.data.tempxp - a.data.xp + a.data.tempxp).slice(0, 10)) {
            e.addField(`Top ${c} - Rank: ${user.data.level}`, `User: ${await getUserName(user.ID)} | Score: ${user.data.xp + user.data.tempxp}`)
            c++
        }
        i.reply({ embeds: [e] })
    }
}