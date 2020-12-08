const Command = require('../Classes/Command.js');
const { serverID, embedsList, moderatorIDs } = require('../helpers.js');

var command = new Command(["EmbedSetURL"], // aliases
	"Assigns a url to an custom embed created by HorizonsBot", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetURL (message ID) (url)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (moderatorIDs.includes(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (embedsList[messageID]) {
			let url = state.messageArray[0];
			if (url) {
				let guild = receivedMessage.guild;
				if (!guild) {
					guild = receivedMessage.client.guilds.resolve(serverID);
				}
				guild.channels.resolve(embedsList[messageID]).messages.fetch(messageID).then(message => {
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
		receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

module.exports = command;
