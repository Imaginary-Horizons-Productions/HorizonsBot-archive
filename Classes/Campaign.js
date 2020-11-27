const Topic = require('./Topic.js');

module.exports = class Campaign extends Topic {
    constructor () {
        this.channelID = 0;
        this.voiceChannelID = 0;
        this.title = "new-campaign";
        this.description = "The host can describe setting or campaign hooks here with the `setdescription` command.";
        this.hostID = 0; // The host's Discord snowflake
        this.userIDs = []; // An array containing the allowed user snowflakes (excluding the host)
        this.seats = 0; // Maximum number of players in the campaign, 0 = unlimited
        this.system = ''; // string for TRPG system name
        this.timeslot = ''; // string for campaign meeting time
        this.imageURL = ''; // URL for campaign image
    }
}
