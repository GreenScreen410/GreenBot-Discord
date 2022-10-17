import { ButtonBuilder, ButtonStyle } from "discord.js";

export default {
  data: new ButtonBuilder()
    .setLabel("초대")
    .setEmoji("✉️")
    .setStyle(ButtonStyle.Link)
    .setURL("https://discord.com/oauth2/authorize?client_id=767371161083314236&permissions=277028653056&scope=bot%20applications.commands")
};
