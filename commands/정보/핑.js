const { Message, Client } = require("discord.js");

module.exports = {
    name: "핑",
    aliases: ['p'],

    run: async (client, message, args) => {
        message.channel.send(`${client.ws.ping} ws ping`);
    },
};