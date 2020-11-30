const Command = require('../Classes/Command.js');
const { Permissions } = require('discord.js');
var helpers = require('../helpers.js');

var command = new Command(["EmbedSetURL"], // aliases
	"Assigns a url to an custom embed created by HorizonsBot", // description
	"Permission to Manage Webhooks, must be used from a server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetURL (message ID) (url)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (receivedMessage.guild) {
		if (receivedMessage.member.hasPermission(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
			let messageID = state.messageArray.shift();
			if (helpers.embedsList[messageID]) {
				let url = state.messageArray[0];
				if (url) {
					receivedMessage.guild.channels.resolve(helpers.embedsList[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setURL(url).setTimestamp();
						message.edit("", embed);
					})
				} else {
					receivedMessage.author.send(`Your url for a \`${state.command}\` command could not be parsed.`)
						.catch(console.error);
				}
			} else {
				receivedMessage.author.send(`The embed you provided for a \`${state.command}\` command could not be found.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`You need permission to manage webhooks to use the \`${state.command}\` command.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`The \`${state.command}\` command must be used from a server channel.`)
			.catch(console.error);
	}
}

module.exports = command;
