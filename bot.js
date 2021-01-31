const { Client } = require('discord.js');
const { getCommand } = require('./Commands/CommandsList.js');
var helpers = require('./helpers.js');

const client = new Client();

login();

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}\n`);
    client.user.setActivity(`"@HorizonsBot help"`)
        .catch(console.error);

    // Update pinned lists
    client.guilds.fetch(helpers.guildID).then(guild => {
        helpers.updateTopicList(guild.channels).then(message => {
            helpers.createJoinCollector(message);
        });
    })
})

let topicBuriedness = 0;

client.on('message', receivedMessage => {
    if (receivedMessage.channel.id === helpers.listMessages.topics.channelID) {
        topicBuriedness += 1;
        if (topicBuriedness > 19) {
            receivedMessage.guild.channels.resolve(helpers.listMessages.topics.channelID).messages.fetch(helpers.listMessages.topics.messageID).then(oldMessage => {
                oldMessage.delete({ "reason": "bump topics pin" });
            })
            helpers.pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
            topicBuriedness = 0;
        }
    }
    if (receivedMessage.author.bot) {
        return;
    }

    var messageArray = receivedMessage.content.split(" ").filter(element => {
        return element != "";
    });

    let command;
    if (messageArray.length > 0) {
        let firstWord = messageArray.shift();
        if (receivedMessage.guild) {
            // Message from guild
            firstWord = firstWord.replace(/\D/g, ""); // bot mention required
            if (messageArray.length == 0 || (firstWord != client.user.id && (helpers.roleIDs.permissions == "" || firstWord != helpers.roleIDs.permissions))) {
                return;
            }
            command = messageArray.shift();
        } else {
            // Message from private message
            if (firstWord.replace(/\D/g, "") == client.user.id) {
                command = messageArray.shift();
            } else {
                command = firstWord;
            }
        }

        let state = {
            "command": command.toLowerCase(),
            "messageArray": messageArray,
        }
        let usedCommand = getCommand(state.command);
        if (usedCommand) {
            usedCommand.execute(receivedMessage, state);
        } else {
            receivedMessage.author.send(`**${state.command}** does not appear to be a HorizonsBot command. Please check for typos!`)
                .catch(console.error);
        }
    }
})

client.on('guildMemberRemove', member => {

})

client.on('channelDelete', channel => {
    let channelID = channel.id;
    let topicList = helpers.getTopicList();
    if (topicList.includes(channelID)) {
        helpers.setTopicList(topicList.filter(id => id != channelID))
        helpers.updateTopicList(channel.guild.channels);
        helpers.removeTopicEmoji(channelID);
    } else if (Object.keys(helpers.campaignList).includes(channelID)) {
        //TODO implement for campaigns
    }
})

client.on('disconnect', (error, code) => {
    console.log(`Disconnect encountered (Error code ${code}):`);
    console.log(error);
    console.log(`---Restarting`);
    login();
})

client.on('error', (error) => {
    console.log(`Error encountered:`);
    console.log(error);
    console.log(`---Restarting`);
    login();
})

function login() {
    let { token } = require('./auth.json');
    client.login(token)
        .catch(console.error);

}
