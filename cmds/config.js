module.exports = {
    name: "config",
    run(i, client) {
        if(!client.config.has(i.guildId)) {
            client.config.set(i.guildId, {slient: false, cooldown: 30, points: 5})
        }
        if(!i.member.permissions.has("ADMINISTRATOR")) {
            return i.reply({content: "You're not allowed to use this command", ephemeral: true })
        }
        switch(i.options.getSubcommand()) {
            case 'slient':
                if(i.options.getBoolean("value")) {
                    const slient = i.options.getBoolean("value")
                    client.config.set(`${i.guildId}.slient`, slient)
                    i.reply(`Slient has been set to **${slient}**`)
                } else {
                    const value = client.config.get(`${i.guildId}.slient`)
                    client.config.set(`${i.guildId}.slient`, !value)
                    i.reply(`Slient has been set to **${!value}**`)
                }
                break;
            case 'cooldown':
                const time = i.options.getInteger("value")
                if(time < 0) return i.reply({ content: "You can't set negative number", ephemeral: true })
                client.config.set(`${i.guildId}.cooldown`, time)
                i.reply(`Cooldown has been set to **${time}**!`)
                break;
            case 'points':
                const points = i.options.getInteger("value")
                client.config.set(`${i.guildId}.points`, points)
                i.reply(`Points has been set to **${points}**!`)
                break;
        }
    }
}