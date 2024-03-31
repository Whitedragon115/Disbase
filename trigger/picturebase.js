const { EmbedBuilder } = require('@discordjs/builders');
const { Events } = require('discord.js');
const { create } = require('discord-timestamps')
const { PicInputChannel, output } = require('../config.json');
const { checklink, shortlink } = require('../function/shotelink.js');
const interactionCreate = require('../events/interactionCreate');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {

        if (message.author.bot) return;
        if (message.channel.id !== PicInputChannel) return;
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
                .setTitle('請傳送圖片或影片')
                .setDescription('在這個頻道中請輸入圖片才能發送圖片連結喔')
                .addFields({ name: '訊息刪除倒數', value: c })
                .setColor(0xff0000)
                .setTimestamp();

            const msg = await message.reply({ embeds: [embed] });
            return setTimeout(() => {
                message.delete();
                msg.delete();
            }, 5000);
        } else {
            let foundImageOrVideo = false;
            message.attachments.forEach(attachment => {
                if (attachment.contentType.startsWith('image/') || attachment.contentType.startsWith('video/')) {
                    foundImageOrVideo = true;
                }
            });

            if (!foundImageOrVideo) {
                const embed = new EmbedBuilder()
                    .setTitle('請傳送圖片或影片')
                    .setDescription('在這個頻道中請輸入圖片或影片才能發送圖片連結喔')
                    .setColor(0xff0000)
                    .setTimestamp();

                const msg = await message.reply({ embeds: [embed] });
                return setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 5000);
            }
        }



        const picfile = Array.from(message.attachments.values());
        const customname = message.content.slice(1, -1).split('/');
        if (picfile.length < customname.length) {
            const msg = await message.reply(`圖片數量與註解數量不符合\n> 你的訊息在${await create(10, 'RELATIVE')}秒後會被刪除`)
            return setTimeout(() => {
                msg.delete();
                message.delete();
            }, 10000);
        }

        const opchannel = client.channels.cache.get(output);
        handleImageUpload(0);


        const msg = await message.reply({ content: '圖片已上傳，請稍後\n> 你的訊息在' + await create(picfile.length + 1, 'RELATIVE') + '秒後會被刪除', allowedMentions: { repliedUser: false } });
        setTimeout(() => {
            message.delete();
            msg.delete();
        }, picfile.length * 1000);

        // ====================[ Function ]=====================
        async function handleImageUpload(index) {
            if (index >= picfile.length) {
                return;
            }

            const currentPic = picfile[index];
            const slink = await shortlink(currentPic.proxyURL, "", false);
            const embed = new EmbedBuilder()
                .setTitle("新的圖片已上傳")
                .setDescription(`**檔名：**\`${currentPic.name}\``)
                .addFields(
                    { name: '圖高  ×  圖寬', value: `\`${currentPic.height}\`  **×**  \`${currentPic.width}\``, inline: true },
                    { name: '圖片大小', value: `${(currentPic.size / (1024 * 1024)).toFixed(2)} MB`, inline: true },
                    { name: '縮短連結', value: `\`\`\`${slink.link}\`\`\`` },
                    { name: '創建時間', value: `> <t:${slink.time}:R>`, inline: true },
                    { name: '連結轉換', value: "> 無", inline: true },
                    { name: '原始連結', value: `> [點我](${currentPic.proxyURL})`, inline: true }
                )
                .setFooter({
                    text: '註解：' + (customname[index] ? customname[index] : "無註解"),
                    iconURL: message.author.avatarURL()
                })
                .setThumbnail(currentPic.url)
                .setTimestamp()
                .setColor(0x00ff00);

            if(currentPic.contentType.startsWith('video/')){
                embed.setThumbnail("https://cdn2.iconfinder.com/data/icons/custom-ios-14-1/60/Zoom-64.png");
            }

            opchannel.send({ embeds: [embed] });
            setTimeout(() => {
                handleImageUpload(index + 1);
            }, 500);
        }
    }
}

