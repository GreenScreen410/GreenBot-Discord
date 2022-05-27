const { Formatters } = require("discord.js");
const client = require("../index");
const ERROR = require("../commands/ERROR");

client.on("modalSubmit", async (modal) => {
  if (modal.customId === "건의사항") {
    const firstResponse = modal.getTextInputValue("suggestion");
    modal.reply({ content: "Testing!" });
  }
});
