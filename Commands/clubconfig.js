const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command("club-config", "Configure a club's information");

command.data.addStringOption(option => option.setName("name").setDescription("The new name for the club").setRequired(false))
	.addStringOption(option => option.setName("description").setDescription("The text to set as the club description").setRequired(false))
	.addStringOption(option => option.setName("game").setDescription("The text to set as the club game").setRequired(false))
	.addIntegerOption(option => option.setName("maxmembers").setDescription("The maximum number of members for the club").setRequired(false))
	.addStringOption(option => option.setName("timeslot").setDescription("The text to set for the club timeslot").setRequired(false));

command.execute = (interaction) => {
	// Rename the text voice channels associated with receiving channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostID) {
			var updatedSettings = [];
			if (interaction.options.getString("name")) {
				club.title = interaction.options.getString("name");
				interaction.channel.setName(club.title);
				interaction.guild.channels.resolve(club.voiceChannelID).setName(club.title + " Voice");
				updatedSettings.push("name");
			}
			if (interaction.options.getString("description")) {
				club.description = interaction.options.getString("description");
				interaction.channel.setTopic(club.description);
				updatedSettings.push("description");
			}
			if (interaction.options.getString("game")) {
				club.system = interaction.options.getString("game");
				updatedSettings.push("game");
			}
			if (interaction.options.getInteger("maxmembers")) {
				club.seats = interaction.options.getInteger("maxmembers");
				updatedSettings.push("max members");
			}
			if (interaction.options.getString("timeslot")) {
				club.timeslot = interaction.options.getString("timeslot");
				updatedSettings.push("timeslot");
			}
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: `The following club setting(s) have been updated: ${updatedSettings.join(', ')}`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Configuring club settings is restricted to the club leader and Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please configure club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;