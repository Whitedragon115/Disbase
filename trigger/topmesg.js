const { Events } = require('discord.js');
const { PicInputChannel } = require('../config.json')

module.exports = {
    name: Events.ClientReady,
    async execute(interaction, client) {
        const channel = interaction.channels.cache.get(PicInputChannel);

        const embed = new EmbedBuilder()
            .setColor(0x67c773)
            .setTitle('你可以在這傳送圖片或是檔案')
            .setDescription('使用方式')

        const msg = await channel.messages.fetch();
        const msg_ = msg.find(m => m.id == TicketChannelMsgId);
        if (!TicketChannelMsgId || !msg_ || msg_.author.id != clientId) {
            const message = await channel.send({ embeds: [embed], components: [row] });
            message.react('🔒');
            return editdata('TicketChannelMsgId', message.id)
        } else {
            const editmsg = await channel.messages.fetch(TicketChannelMsgId);
            editmsg.edit({ embeds: [embed], components: [row] });
        }
    }
}
