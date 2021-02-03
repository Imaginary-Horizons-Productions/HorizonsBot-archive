const Command = require('../Classes/Command.js');
const { isModerator, getCampaignList, setCampaignList, updateList } = require("../helpers.js");

var command = new Command(["CampaignSetSystem"], // aliases
	"Sets the system for a campaign", // description
	"Moderator or Campaign Host, use from campaign text channel", // requirements
	["__Example__ - replace ( ) with your settings"], // headings
	["`@HorizonsBot CampaignSetSystem (system)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the decription for the receiving campaign channel
	let campaigns = getCampaignList();
	if (campaigns[receivedMessage.channel.id]) {
		if (isModerator(receivedMessage.author.id) || receivedMessage.author.id == campaigns[receivedMessage.channel.id].hostID) {
			let system = state.messageArray.join(' ');
			if (system) {
				campaigns[receivedMessage.channel.id].system = system;
				setCampaignList(campaigns);
				receivedMessage.author.send(`${campaigns[receivedMessage.channel.id].name}'s system has been set as ${system}.`)
					.catch(console.error);
				updateList(receivedMessage.guild.channels, "campaigns");
			} else {
				receivedMessage.author.send(`Please provide the system for the campaign.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`Setting a campaign system is restricted to the host of that campaign or Moderators.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please set campaign settings from the camapaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
