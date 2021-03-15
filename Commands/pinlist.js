const Command = require('../Classes/Command.js');
const { isModerator, pinTopicsList, pinCampaignsList } = require('../helpers.js');

var command = new Command(["PinList"], // aliases
	"Pin a list of topics or campaigns", // description
	"Moderator, use from server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot PinList (topic or campaign)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Command specifications go here
	if (isModerator(receivedMessage.author.id)) {
		if (receivedMessage.guild) {
			if (state.messageArray.length > 0) {
				let listType = state.messageArray[0].toLowerCase();
				if (listType == "topic" || listType == "topics") {
					pinTopicsList(receivedMessage.guild.channels, receivedMessage.channel);
				} else if (listType == "campaign" || listType == "campaigns") {
					pinCampaignsList(receivedMessage.guild.channels, receivedMessage.channel);
				} else {
					receivedMessage.author.send(`Please specify either \`topic\` or \`campaign\` for the type of list to pin.`)
						.catch(console.log);
				}
			}
		} else {
			receivedMessage.author.send(`Pinning topic or campaign lists is restricted to Moderators.`)
				.catch(console.log);
		}
	} else {
		receivedMessage.author.send(`Please specify either \`topic\` or \`campaign\` for the type of list.`)
			.catch(console.log);
	}
}

module.exports = command;
