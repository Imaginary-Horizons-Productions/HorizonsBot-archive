const Command = require('../Classes/Command.js');
const { guildID, customEmbedsmbeds, isModerator } = require('../helpers.js');

var command = new Command(["EmbedSetFooter"], // aliases
	"Assigns a footer to a custom embed", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetFooter (message ID) (text),, [iconURL]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the footer for the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (customEmbeds[messageID]) {
			let iconURL = state.messageArray.join(' ');
			iconURL = iconURL.split(",, ");
			let text = iconURL.shift();
			if (text) {
				iconURL = iconURL.toString();
				receivedMessage.client.guilds.fetch(guildID).then(guild => {
					guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setFooter(text, iconURL).setTimestamp();
						message.edit("", embed);
					})
				})
			} else {
				receivedMessage.author.send(`Your footer text for a \`${state.command}\` command could not be parsed.`)
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
