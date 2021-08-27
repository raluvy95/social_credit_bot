module.exports = {
    name: "remove",
    run(i, client) {
        if(!i.member.permissions.has("ADMINISTRATOR")) {
            return i.reply({content: "You're not allowed to use this command", ephemeral: true })
        }
        user = i.options.getUser("user")
        score = i.options.getInteger("score")
        if(!client.XP.has(user.id)) {
            client.XP.set(`${user.id}.xp`, -score)
        } else {
            client.XP.subtract(`${user.id}.xp`, score)
        }
        i.reply(`Removed **${score}** from ${user.username}!`)
    }
}