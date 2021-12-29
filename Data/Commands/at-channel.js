const Command = require('../../Classes/Command.js');
const { atIds, timeConversion } = require('../../helpers.js');

let options = [
	{ type: "String", name: "message", description: "The text to go with the notification", required: true, choices: {} },
	{ type: "String", name: "type", description: "Who to notify with the message", required: false, choices: { "Only notifiy online users in this channel": "@here", "Also notify offline users in this channel": "@everyone" } }
];
module.exports = new Command("at-channel", "Send a ping to the current channel", options);

module.exports.execute = (interaction) => {
	// Send a rate-limited ping
	if (!atIds.has(interaction.user.id)) {
		atIds.add(interaction.user.id);
		setTimeout((timeoutId) => {
			atIds.delete(timeoutId);
		}, timeConversion(5, "m", "ms"), interaction.user.id);
		interaction.reply(`${interaction.options.getString("type") === "@everyone" ? "@everyone" : "@here"} ${interaction.options.getString("message")}`);
	} else {
		interaction.reply({ content: "You may only use `/at-channel` once every 5 minutes. Please wait to send your next at.", ephemeral: true });
	}
}