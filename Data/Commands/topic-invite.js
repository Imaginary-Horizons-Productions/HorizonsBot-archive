const Command = require('../../Classes/Command.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getTopicIDs } = require('../../helpers.js');

let options = [
	{ type: "User", name: "invitee", description: "The user to invite (copy-paste from another channel)", required: true, choices: {} },
	{ type: "Channel", name: "channel", description: "The topic channel to invite to", required: true, choices: {} }
];
module.exports = new Command("topic-invite", "Invite users to this topic", options);

module.exports.execute = (interaction) => {
	// Invite users to the given topic
	var channel = interaction.options.getChannel("channel");
	if (getTopicIDs().includes(channel.id)) {
		var invitee = interaction.options.getUser("invitee");
		let embed = new MessageEmbed()
			.setAuthor({
				name: "Click here to visit the Imaginary Horizons GitHub",
				iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png",
				url: "https://github.com/Imaginary-Horizons-Productions"
			})
			.setDescription(`${invitee} has invited you to the following opt-in channel on Imaginary Horizons.`)
			.addField(channel.name, `${channel.topic ? channel.topic : "Description not yet set"}`);
		if (!invitee.bot) {
			var joinButton = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`join-${channel.id}`)
						.setLabel(`Join ${channel.name}`)
						.setStyle("SUCCESS")
				);
			invitee.send({ embeds: [embed], components: [joinButton] }).then(message => {
				interaction.reply({ content: "An invite has been sent!", ephemeral: true });
			}).catch(console.error);
		} else {
			interaction.reply({ content: "If you would like to add a bot to a topic, speak with a moderator.", ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `The mentioned channel doesn't seem to be a topic channel.`, ephemeral: true })
			.catch(console.error);
	}
}