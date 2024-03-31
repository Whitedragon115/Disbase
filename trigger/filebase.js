const { EmbedBuilder } = require('@discordjs/builders');
const { Events } = require('discord.js');
const { create } = require('discord-timestamps')
const { FileInputChannel, output2 } = require('../config.json');
const { shortlink } = require('../function/shotelink.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {

        if (message.author.bot) return;
        if (message.channel.id !== FileInputChannel) return;
        if (message.content) {
            if (!message.content.startsWith('[') || !message.content.endsWith(']')) {
                const embed = new EmbedBuilder()
                    .setTitle('請傳送正確的文字格式')
                    .setDescription('請這樣輸入"[<註解1>/<註解2>...<註解N>]"')
                    .addFields({ name: '訊息刪除倒數', value: await create(5, 'RELATIVE') })
                    .setColor(0xff0000)
                    .setTimestamp();

                const msg = await message.reply({ embeds: [embed] });
                return setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 5000);
            };
        }
        if (!message.attachments.size) {
            let c = await create(5, 'RELATIVE')
            const embed = new EmbedBuilder()
                .setTitle('請傳一個或多個檔案')
                .setDescription('在這個頻道中傳送檔案才能運作')
                .addFields({ name: '訊息刪除倒數', value: c })
                .setColor(0xff0000)
                .setTimestamp();

            const msg = await message.reply({ embeds: [embed] });
            return setTimeout(() => {
                message.delete();
                msg.delete();
            }, 5000);
        }

        let foundImageOrVideo = true;
        await message.attachments.forEach(attachment => {
            if (attachment.contentType.startsWith('image/') || attachment.contentType.startsWith('video/')) {
                foundImageOrVideo = false;
            }
        });

        if (!foundImageOrVideo) {
            const embed = new EmbedBuilder()
                .setTitle('如果要傳送圖片或影片，請至另一個上傳區域')
                .setDescription('你的檔案中可能包含了圖片影片的檔案，在這個頻道中請傳送除了圖片或影片才能紀錄檔案連結喔')
                .setColor(0xff0000)
                .setTimestamp();

            const msg = await message.reply({ embeds: [embed] });
            return setTimeout(() => {
                message.delete();
                msg.delete();
            }, 5000);
        }

        const attachments = Array.from(message.attachments.values());
        const annotations = message.content.slice(1, -1).split('/');
        if (attachments.length < annotations.length) {
            const msg = await message.reply(`檔案數量與註解數量不符合\n> 你的訊息在${await create(10, 'RELATIVE')}秒後會被刪除`)
            return setTimeout(() => {
                msg.delete();
                message.delete();
            }, 10000);
        }

        const outputChannel = client.channels.cache.get(output2);
        handleImageUpload(0);

        const totalSize = attachments.reduce((acc, attachment) => acc + attachment.size, 0) >= (1024 * 1024) ? '`' + (attachments.reduce((acc, attachment) => acc + attachment.size, 0) / (1024 * 1024)).toFixed(2) + "` MB" : '`' + (attachments.reduce((acc, attachment) => acc + attachment.size, 0) / 1024).toFixed(2) + "` KB";

        const embed = new EmbedBuilder()
            .setTitle('檔案上傳中')
            .setDescription(`檔案已上傳，請稍後\n> 你的訊息在${await create(attachments.length + 1, 'RELATIVE')}秒後會被刪除`)
            .setFields(
                { name: '上傳數量', value: '總計 `' + attachments.length + '` 個', inline: true },
                { name: '總共大小', value: totalSize, inline: true }
            )
            .setColor(0x7aff7a)
            .setTimestamp();

        const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        setTimeout(() => {
            message.delete();
            msg.delete();
        }, attachments.length * 1000);

        // ====================[ Function ]=====================
        async function handleImageUpload(index) {
            if (index >= attachments.length) {
                return;
            }

            const currentAttachment = attachments[index];
            const shortLink = await shortlink(currentAttachment.proxyURL, "", false);
            const embed = new EmbedBuilder()
                .setTitle("新的圖片已上傳")
                .setDescription(`**檔名：**\`${currentAttachment.name}\``)
                .addFields(
                    { name: '檔案類型', value: `\`${currentAttachment.contentType}\``, inline: true },
                    { name: '檔案大小', value: currentAttachment.size >= (1024*1024) ? (currentAttachment.size / (1024 * 1024)).toFixed(2) + "MB" : (currentAttachment.size / 1024).toFixed(2) + "KB", inline: true },
                    { name: '縮短連結', value: `\`\`\`${shortLink.link}\`\`\`` },
                    { name: '創建時間', value: `> <t:${shortLink.time}:R>`, inline: true },
                    { name: '連結轉換', value: "> 無", inline: true },
                    { name: '原始連結', value: `> [點我](${currentAttachment.proxyURL})`, inline: true }
                )
                .setFooter({
                    text: '註解：' + (annotations[index] ? annotations[index] : "無註解"),
                    iconURL: message.author.avatarURL()
                })
                .setThumbnail(currentAttachment.url)
                .setTimestamp()
                .setColor(0x7aff7a);

            if (currentAttachment.contentType.startsWith('video/')) {
                embed.setThumbnail("https://cdn2.iconfinder.com/data/icons/custom-ios-14-1/60/Zoom-64.png");
            }

            outputChannel.send({ embeds: [embed] });
            setTimeout(() => {
                handleImageUpload(index + 1);
            }, 500);
        }
    }
}
