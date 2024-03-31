const { Events } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { PicInputChannel, FileInputChannel, clientId } = require('../config.json')

module.exports = {
    name: Events.ClientReady,
    async execute(interaction, client) {
        const channel = interaction.channels.cache.get(PicInputChannel);
        const channel2 = interaction.channels.cache.get(FileInputChannel);

        const embed = new EmbedBuilder()
            .setColor(0x71eeff)
            .setTitle('你可以在這傳送圖片或是影片 :camera:')
            .setDescription('在這個頻道中你可以傳送圖片或是影片，機器人會幫你處理圖片的連結並且處理成短網址，**不過第一次使用前你可以先看以下入門使用介紹** =>')
            .addFields(
                { name: '安全性', value: '- 請不要傳送任何不當的圖片或是影片，這個頻道是公開的，所有人都可以看到你傳送的內容\n- 圖片傳送後機器人會根據你傳送的圖片數量在相對的時間後刪除圖/影片，且記錄到你的個人圖檔區\n- 如果想要刪除個人圖檔區的圖片，你可以對訊息新增反應 :x:\n- 如果想要把訊息轉換成星號圖片可以點選 :star:' },
                { name: '注意事項', value: '- 一次上傳的圖片只能最多10張( Discord限制 )，那不然會上傳不了\n- 可以影片圖片混合上傳不會影響，但是一樣總共最多十個檔案\n- 一個檔案大小最多25MB，Nitro無限制但是總共最多500MB，會在新增無限制的辦法' },
                { name: '特殊語法', value: '- 你可以為每個圖檔新增註解，語法為這樣\n - 輸入文字必須在前加入"["，後加入"]"\n - 中間是給每個圖片的註解，可用於紀錄圖片內容\n - 每個註解以"/"分開\n - 註解數量不能大於圖片傳送數量\n - 一次註解文字不能超過10個字元\n- 這是一個範例"\`[<註解一>/<註解二>/...../<註解N>]\`"' }
            )
            .setTimestamp();

        const embed2 = new EmbedBuilder()
            .setColor(0x71eeff)
            .setTitle('你可以在這傳送所有檔案 :file_folder:')
            .setDescription('在這個頻道中你可以所有檔案除了圖影片，機器人會幫你處理檔案的連結並且處理成短網址，**不過第一次使用前你可以先看以下入門使用介紹** =>')
            .addFields(
                { name: '安全性', value: '- 請不要傳送任何不當的檔案，這個頻道是公開的，所有人都可以看到你傳送的內容\n- 圖片傳送後機器人會根據你傳送的圖片數量在相對的時間後刪除檔案，且記錄到你的個人檔案區\n- 如果想要刪除個人檔案區的檔案，你可以對訊息新增反應 :x:\n- 如果想要把訊息轉換成星號檔案可以點選 :star:' },
                { name: '注意事項', value: '- 一次上傳的檔案只能最多10個( Discord限制 )，那不然會上傳不了\n- 可以不同檔案混合上傳不會影響，但是一次總共最多十個檔案\n- 一個檔案大小最多25MB，Nitro無限制但是總共最多500MB，會在新增無限制的辦法' },
                { name: '特殊語法', value: '- 你可以為每個檔案新增註解，語法為這樣\n - 輸入文字必須在前加入"["，後加入"]"\n - 中間是給每個檔案的註解，可用於紀錄檔案內容\n - 每個註解以"/"分開\n - 註解數量不能大於檔案傳送數量\n - 一次註解文字不能超過10個字元\n- 這是一個範例"\`[<註解一>/<註解二>/...../<註解N>]\`"' }
            )
            .setTimestamp();

        const msg = await channel.messages.fetch();
        const msg_ = msg.find(async m => m.id == await client.db.get('pictureChannelMsgId'));
        const msg__ = msg.find(async m => m.id == await client.db.get('fileChannelMsgId'));

        if (!await client.db.get('pictureChannelMsgId') || !msg_ || msg_.author.id != clientId) {
            const message = await channel.send({ embeds: [embed] });
            message.react('🔒');
            return await client.db.set('pictureChannelMsgId', message.id);
        } else {
            const editmsg = await channel.messages.fetch(await client.db.get('pictureChannelMsgId'));
            editmsg.edit({ embeds: [embed] });
        }

        if (!await client.db.get('fileChannelMsgId') || !msg__ || msg__.author.id != clientId) {
            const message = await channel2.send({ embeds: [embed2] });
            message.react('🔒');
            return await client.db.set('fileChannelMsgId', message.id);
        } else {
            const editmsg = await channel2.messages.fetch(await client.db.get('fileChannelMsgId'));
            editmsg.edit({ embeds: [embed2] });
        }
    }
}