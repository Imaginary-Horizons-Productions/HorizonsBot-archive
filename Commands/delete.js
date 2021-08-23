const Command = require('../Classes/Command.js');
const { isModerator, getManagedChannels } = require('../helpers.js');

var command = new Command(["Delete"], // aliases
	"Delete a topic or club channel, delay supported", // description
	"Moderator, use the command in a topic or club channel to delete", // requirements
	["Example - replace [ ] with settings (optional)"], // headings
	["`@HorizonsBot Delete [delay in hours]`"]); // texts (must match number of headings)

command.data.addIntegerOption(option => option.setName("delay").setDescription("Number of hours to delay deleting the channel").setRequired(false));

command.execute = (receivedMessage, state) => {
	// Delete a topic or club channel, or set it to be deleted on a delay
	if (isModerator(receivedMessage.author.id)) {
		if (getManagedChannels().includes(receivedMessage.channel.id)) {
			let delay = parseFloat(state.messageArray[0]);
			if (!isNaN(delay)) {
				receivedMessage.channel.send(`This channel has been scheduled to be deleted in ${delay} hour(s).`)
					.catch(console.error);
				setTimeout(() => {
					receivedMessage.channel.delete()
						.catch(console.log);
				}, delay * 3600000)
			} else {
				receivedMessage.channel.delete()
					.catch(console.log);
			}
		} else {
			receivedMessage.author.send("The delete command can only be used on topic or club channels.")
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send("Deleting channels is restricted to Moderators.")
			.catch(console.error);
	}
}

command.executeInteraction = (interaction) => {
	// Delete a topic or club channel, or set it to be deleted on a delay
	if (isModerator(interaction.user.id)) {
		if (getManagedChannels().includes(interaction.channel.id)) {
			let delay = parseFloat(interaction.options.getInteger("delay"));
			if (!isNaN(delay)) {
				interaction.reply(`This channel has been scheduled to be deleted in ${delay} hour(s).`)
					.catch(console.error);
				setTimeout(() => {
					interaction.channel.delete()
						.catch(console.error);
				}, delay * 3600000)
			} else {
				interaction.channel.delete()
					.catch(console.error);
			}
		} else {
			interaction.reply({ content: "The delete command can only be used on topic or club channels.", ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: "Deleting channels is restricted to Moderators.", ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
