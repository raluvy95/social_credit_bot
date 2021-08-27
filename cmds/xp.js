module.exports = {
    name: "xp",
    run(i, client) {
        const user = i.options.getUser("user", false)
        const e = new client.Embed()
            .setColor("RANDOM")
        if (!user) {
            e.setTitle("Your social credit score")
            if (!client.XP.has(i.user.id)) {
                e.setDescription("You don't have social credit :(")
            } else {
                const xp = client.XP.get(i.user.id)
                e.addField("Score", String(xp.xp + xp.tempxp), true)
                .addField("Rank", xp.level, true)
            }
        } else {
            e.setTitle(`${user.username}'s social credit score`)
            if (!client.XP.has(user.id)) {
                e.setDescription("He/She doesn't have social credit :(")
            } else {
                try {
                    const xp = client.XP.get(user.id)
                    e.addField("Score", String(user.xp + user.tempxp), true)
                } catch (err) {
                    i.reply("Sorry, but there was an problem while sending...")
                    console.error(err);
                }
            }
        }
        i.reply({ embeds: [e] })
    }
}