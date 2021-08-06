module.exports = class Club {
    constructor () {
        this.channelID = 0;
        this.voiceChannelID = 0;
        this.title = "new-club";
        this.description = "The host can change this text with the `ClubSetDescription` command.";
        this.hostID = 0; // The host's Discord snowflake
        this.userIDs = []; // An array containing the allowed user snowflakes (excluding the host)
        this.seats = 0; // Maximum number of players in the club, 0 = unlimited
        this.system = '\u200B'; // string for TRPG system name
        this.timeslot = '\u200B'; // string for club meeting time
        this.imageURL = ''; // URL for club image
    }
}