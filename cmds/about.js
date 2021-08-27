const jsyaml = require("js-yaml")
const fs = require("fs")
const configuration = jsyaml.load(fs.readFileSync('./config.yaml', 'utf8'))

module.exports = {
    name: "about",
    async run(i, client) {
        const {version} = require("discord.js")
        async function owners() {
            const users = []
            for(const ID of configuration.owners) {
                const user = await client.users.fetch(ID)
                users.push({ID: ID, name: `${user.username}#${user.discriminator}`})
            }
            return users.map(m => `${m.name} (${m.ID})`).join(", ")
        }
        const cont = `Uses discord.js ${version} and node.js ${process.version}
Bot developer: ${await owners()}
This bot is based on China's social credit system.
You can see more details in one image below.\nhttps://cdn.discordapp.com/attachments/838781799080394830/880420032377667654/iu.png`
        i.reply({ content: cont, ephemeral: true })
    }
}
