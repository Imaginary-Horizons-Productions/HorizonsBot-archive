const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');
const { moderatorIDs, embedsList, saveObject } = require('../helpers.js');

var command = new Command(["MessageEmbed"], // aliases
	"Makes a new MessageEmbed, configurable with other commands", // description
	"Moderator, must be used from a server channel", // requirements
	["Example"], // headings
	["`@HorizonsBot MessageEmbed`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Create a new MessageEmbed
	if (receivedMessage.guild) {
		if (moderatorIDs.includes(receivedMessage.author.id)) {
			let embed = new MessageEmbed().setTimestamp();
			receivedMessage.channel.send("Here's your new embed.", embed).then(message => {
				embedsList[message.id] = message.channel.id;
				saveObject(embedsList, "embedsList.json");
			}).catch(console.error);
		} else {
			receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`The \`${state.command}\` command must be used from a server channel.`)
			.catch(console.error);
	}
}

module.exports = command;
