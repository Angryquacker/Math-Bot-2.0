const Discord = require('discord.js');
const sqlite = require('sqlite3').verbose();
const token = 'NDI1Nzg1OTAwMTgyNjY3Mjc1.Di2m2A.iGe4lOXaLoGZ7R7Jwct2XogFAIs';
let bot = new Discord.Client();
var pm;

bot.on('ready', async () => {
    console.log('Ready');
    bot.user.setActivity('Use "!Math help" for help!');
});

bot.on('message', async (message) => {
    if(message.author.bot) return;
    
    let prefix = '!Math';
    let messageP = message.content.split(" ");
    
    if(messageP[0] == prefix) {
        messageP.shift();
        let cmd = messageP[0].toLowerCase();
        switch(cmd) {
            case 'help':
                message.author.send(help());
                break;
            case 'status':
                numOfGuilds();
                setTimeout(function() {
                    message.channel.send(pm);
                }, 500);
                break;
            case 'cosine':
                message.channel.send(cosine(messageP[1]));
                break;
            case 'absolute':
                message.channel.send(abs(messageP[1]));
                break;
        }
    }
});

bot.on('guildCreate', guild => {
    let db = new sqlite.Database('Data.db');
    db.run(`INSERT INTO guildData(guildName) VALUES(?)`, [guild.name], (err) => {
        if (err) {
            console.log('DATABASE ERROR! - ' + err.message);
        }
    });
    db.close();
});

bot.on('guildDelete', guild => {
    let db = new sqlite.Database('Data.db');
    db.run(`DELETE FROM guildData WHERE guildName = ?`, [guild.name], (err) => {
        if (err) {
            console.log('DATABASE ERROR! - ' + err.message);
        }
    });
    db.close();
});

function numOfGuilds() {
    let db = new sqlite.Database('Data.db');
    db.all(`SELECT * FROM guildData`, [], (err, rows) => {
        if (err) {
            console.log('DATABASE ERROR! - ' + err.message);
            pm = 'Some form of error has occured';
        } else {
            let x = 0;
            for (let i = 0;i < rows.length;i++) {
                x++;
            }
            pm = `Math Bot is on ${x} Guilds`;
        }
    });
    db.close(); 
}

function cosine(num) {
    return Math.cos(num);
}

function abs(num) {
    return Math.abs(num);
}

function help() {
    return `
    Valid Commands are: 
    help - Returns all valid commands.
    status - Returns the number of guilds Math Bot is on.
    cosine - Returns the cosine of the entered number.
    absolute - Returns the absolute value of the entered number.
    `;
}

bot.login(token);