const Command = require('../Classes/Command.js');
const { Permissions } = require('discord.js');
var helpers = require('../helpers.js');

var command = new Command(["EmbedSetTitle"], // aliases
	"Assigns a title to an custom embed created by HorizonsBot", // description
	"Permission to Manage Webhooks", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetTitle (message ID) (title)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (receivedMessage.member.hasPermission(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
		let messageID = state.messageArray.shift();
		if (helpers.embedsList[messageID]) {
			let title = state.messageArray.join(' ');
			if (title) {
				receivedMessage.guild.channels.resolve(helpers.embedsList[messageID]).messages.fetch(messageID).then(message => {
					let embed = message.embeds[0].setTitle(title).setTimestamp();
					message.edit("", embed);
				})
			} else {
				receivedMessage.author.send(`Your title for a \`${state.command}\` command could not be parsed.`)
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
}

module.exports = command;
