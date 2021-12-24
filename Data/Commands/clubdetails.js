const Command = require('../../Classes/Command.js');
const { getClubs, isModerator, updateClubDetails, updateClub } = require("./../../helpers.js");

let options = [];
module.exports = new Command("club-details", "(club leader or morderator) Posts and pins the club's details embed", options);

module.exports.execute = (interaction) => {
	// Posts and pins the club details embed
	let club = getClubs()[interaction.channelId];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostID)) {
			updateClubDetails(club, interaction.channel);
			interaction.reply({ content: "The club's details have been updated.", ephemeral: true }).catch(console.error);
			updateClub(club, interaction.guild.channels);
		} else {
			interaction.reply({ content: `Pinning club details is restricted to the current club leader and Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please pin club details from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}
