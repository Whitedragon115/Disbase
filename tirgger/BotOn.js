const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { VerifyChannel, RuleChannel, emojiverify, verifyMsgId } = require('../config.json');

module.exports = {
    name: 'ready',
    async execute(interaction, client) {
        console.log('Bot is ready');
    }
}
