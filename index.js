const Discord = require("discord.js")
const SocialCredit = require("./classes/Client.js")
const fs = require("fs")
const jsyaml = require("js-yaml")
const client = new SocialCredit()

const configuration = jsyaml.load(fs.readFileSync('./config.yaml', 'utf8'))

const SOCIAL_CREDIT_APPROVE = "https://cdn.discordapp.com/attachments/868162230288531457/880179345111523328/unknown.png"
const SOCIAL_CREDIT_DENY = "https://cdn.discordapp.com/attachments/868162230288531457/880179374412947526/unknown.png"


const cmds = fs.readdirSync("./cmds/")
for (const commands of cmds) {
    try {
        const command = require(`./cmds/${commands}`)
        client.cmds.set(command.name, command)
    } catch (err) {
        console.error("Looks like there's something went wrong\n", err)
    }
}

client.on("messageCreate", async message => {
    if(!client.config.has(message.guildId)) {
        client.config.set(message.guildId, {slient: false, cooldown: 60, points: 5})
    }
    if (message.author.bot) return;
    if (message.content.toLowerCase().startsWith(".eval ")) {
        const owners = configuration.owners
        if(!owners.includes(message.author.id)) return;
        const args = message.content.slice(5).split(" ")
        if (!args) return;
        await client.eval(message, args, client)
        return;
    }
    const now = Date.now()
    const ca = client.config.get(`${message.guildId}.cooldown`) * 1000;
    if (client.cooldown.has(message.channel.id)) {
        const et = client.cooldown.get(message.channel.id) + ca;
        if (now < et) {
            return
        }
    }
    client.cooldown.set(message.channel.id, now);
    setTimeout(() => {
        client.cooldown.delete(message.channel.id);
    }, ca);
    if (!client.XP.has(message.author.id)) {
        client.XP.set(message.author.id, {xp: 0, tempxp: 0, level: 'D'})
    }
    const chance = Math.floor(Math.random() * 100)
    let XP = client.XP.get(message.author.id)
    function level() {
        let {level, xp} = client.XP.get(message.author.id)
        if(xp < 0) level = 'F'
        else if(xp <= 599 && xp >= 0 ) level = 'D'
        else if(xp <= 849 && xp >= 599) level = 'C'
        else if(xp <= 959 && xp >= 850) level = 'B'
        else if(xp <= 999 && xp >= 960) level = 'A-'
        else if(xp <= 1000 && xp >= 1029) level = 'A+'
        else if(xp <= 1030 && xp >= 1049) level ='AA'
        else if(xp >= 1050) level = 'AAA'
        client.XP.set(`${message.author.id}.level`, level)
    }
    const slient = client.config.get(`${message.guildId}.slient`)
    function send(msg) {
        if(!slient) {
            message.reply(msg)
        } else {
            return;
        }
    }
    if(Math.abs(XP.tempxp) >= 15 ) {
        client.XP.set(`${message.author.id}.tempxp`, 0)
        if(XP.tempxp < 0) {
            client.XP.subtract(`${message.author.id}.xp`, Math.abs(XP.tempxp))
            send(SOCIAL_CREDIT_DENY)
        } else {
            client.XP.add(`${message.author.id}.xp`, XP.tempxp)
            send(SOCIAL_CREDIT_APPROVE)
        }
        level()
    }
    const points = client.config.get(`${message.guildId}.cooldown`)
    if (chance >= 30) {
        client.XP.add(`${message.author.id}.tempxp`, points)
    } else {
        client.XP.subtract(`${message.author.id}.tempxp`, points)
    }

})

client.on("debug", info => {
    if (info.includes("Heartbeat")) return;
    console.log(info)
})



client.on("interactionCreate", async i => {
    if (i.isCommand()) {
        const { commandName } = i;
        if (client.cmds.has(commandName)) {
            await client.cmds.get(commandName).run(i, client)
        }
    } else if (i.isButton()) {
        try {
            switch (i.customId) {
                case 'accept':
                    fs.readFile("./cache/evaled.txt", async (err, data) => {
                        output = data.toString()
                        let ttt = (output.length - 1990) / 1990
                        let time = 2;
                        while (true) {
                            const text = output.slice(1990 * (time - 1), 1990 * time)
                            if (!text || text.length == 0) break;
                            await i.message.channel.send(text, { code: "js" }).catch(() => { })
                            time++
                        }
                        fs.rmSync("./cache/evaled.txt")
                    })
                    await i.message.delete().catch(() => { })
                    break;
                case 'reject':
                    i.message.delete()
                    break
                case 'logging':
                    i.update({ content: "Check your console output!", components: [] })
                    fs.readFile("./cache/evaled.txt", async (err, data) => {
                        output = data.toString()
                        console.log(output)
                        fs.rmSync("./cache/evaled.txt")
                    })
                    break
                case 'delete':
                    i.message.delete()
                    break
                case 'file':
                    i.update({ content: "Here's the file!", components: [] })
                    i.message.channel.send({ files: [`${__dirname}/cache/evaled.txt`] })
            }
        } catch (err) {
            await i.followUp()
            i.message.channel.reply(`${err}`).catch(() => { })
        }
    } else {

    }
})

client.login(configuration.token)
