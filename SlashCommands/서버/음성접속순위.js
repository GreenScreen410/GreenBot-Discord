const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();
const mongo = process.env.mongooseConnectionString

module.exports = {
  ...new SlashCommandBuilder().setName("음성접속순위").setDescription("음성 채널 접속 시간 리더보드를 보여줍니다."),

  run: async (client, interaction) => {
    "use strict";
    var __importDefault = (this && this.__importDefault) || function (mod) {
      return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VoiceClient = void 0;
    const mongoose_1 = __importDefault(require("mongoose"));
    const discord_js_1 = require("discord.js");
    const ms_1 = __importDefault(require("ms"));

    class VoiceClient {
      client;
      options;
      schemas = {
        timer: mongoose_1.default.model("djs-voice-timers", new mongoose_1.default.Schema({
          User: String,
          Start: Number,
          Guild: String,
        })),
        user: mongoose_1.default.model("djs-voice-users", new mongoose_1.default.Schema({
          User: String,
          Time: Number,
          Guild: String,
        })),
      };
      constructor(options) {
        if (mongoose_1.default.connection.readyState === 1)
          return;
        if (!options.mongooseConnectionString)
          throw new Error("There is no established  connection with mongoose and a mongoose connection is required!");
        mongoose_1.default.connect(options.mongooseConnectionString, {
          useFindAndModify: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        });
        this.options = options;
        this.client = options.client;
      }
      /**
       * @description Put this inside your voiceStateChange client event!
       * @param {VoiceState} oldState discord.js's VoiceState
       * @param {VoiceState} newState discord.js's VoiceState
       * @returns {Promise<void>}
       */
      async startListener(oldState, newState) {
        if (newState.member.user.bot && !this.options.allowBots)
          return;
        const userID = newState.member.id;
        const guildID = newState.guild.id;
        if (newState.channel &&
          !(await this.schemas.timer.findOne({
            User: userID,
            Guild: guildID,
          }))) {
          // if (this.options.debug)
            // console.log(`${newState.member.user.tag} has joined a voice channel`);
          new this.schemas.timer({
            User: userID,
            Start: Date.now(),
            Guild: guildID,
          }).save();
        }
        if (oldState.channel?.id && !newState.channel?.id) {
          // if (this.options.debug)
            // console.log(`${newState.member.user.tag} has left a voice channel`);
          this.schemas.timer.findOne({ User: userID, Guild: guildID }, async (err, timerData) => {
            if (!timerData)
              return;
            this.schemas.user.findOne({ User: userID, Guild: guildID }, async (err, userData) => {
              const Time = Date.now() - timerData.Start;
              timerData.delete();
              // if (this.options.debug)
                // console.log(ms_1.default(Time, { long: true }) + ` for ${newState.member.user.tag}`);
              if (!userData) {
                new this.schemas.user({
                  User: userID,
                  Time,
                  Guild: guildID,
                }).save();
              }
              else {
                userData.Time += Time;
                userData.save();
              }
            });
          });
        }
      }
      /**
       * @description Fetching and sorting raw data from guild
       * @param {Guild} guild discord.js's guild aka `message.guild`
       */
      async sortUsers(guild) {
        const userLeaderboard = await this.schemas.user
          .find({ Guild: guild.id })
          .sort({ Time: -1 });
        return userLeaderboard;
      }
      /**
       * @description Gives you all the data you need about a user
       * @param {Guild} guild discord.js's guild class aka `message.guild`
       * @param {User} user discord.js's User class
       */
      async getUserData(guild, user) {
        const data = await this.schemas.user.findOne({
          Guild: guild.id,
          User: user.id,
        });
        if (!data)
          return null;
        const position = (await this.sortUsers(guild)).findIndex((x) => x.User === user.id);
        const { User, Time, Guild, _id } = data;
        return { _id, User, Time, Guild, position };
      }
      /**
       * @description Generating a leaderbord
       */
      async generateLeaderboard(options) {
        let { guild, title, color, top, thumbnail } = options;
        const data = await this.sortUsers(guild);
        let i = 1;
        const topTen = data.slice(0, top || 10);
        // if (this.options.debug)
          // console.log(topTen);
        return new discord_js_1.MessageEmbed()
          .setTitle(title || `'**${guild.name}**' 음성채널 접속순위`)
          .setColor(color || "RANDOM")
          .setThumbnail(thumbnail || null)
          .setDescription(topTen.map((x) => { return `\`${i++}\` <@${x.User}> (${ms_1.default(x.Time)})`; })
            .join("\n\n"))
          .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
      }
      /**
       * @description Reset the entire voice system database!
       * @param {Guild} guild discord.js's guild class aka `message.guild`
       */
      async reset(guild) {
        await this.schemas.timer.deleteMany({ Guild: guild.id });
        await this.schemas.user.deleteMany({ Guild: guild.id });
      }
      /**
       * @description Change a user's voice channel time in a specific guild
       * @param {Guild} guild discord.js's guild class aka `message.guild`
       * @param user discord.js's User class
       * @param time Time you want to change in miliseconds
       */
      setTime(guild, user, time) {
        this.schemas.user.findOne({ Guild: guild.id, User: user.id }, async (err, data) => {
          if (err && this.options.debug)
            return console.log(err);
          data.Time = time;
          data.save();
        });
      }
      /**
       * @description Chunk arrays into smaller arrays
       */
      chunkArrays(arr, size) {
        const array = [];
        for (let i = 0; i < arr.length; i += size) {
          array.push(arr.slice(i, i + size));
        }
        return array;
      }
    }
    //# sourceMappingURL=index.js.map

    const voiceClient = new VoiceClient({
      allowBots: false,
      client: client,
      debug: true,
      mongooseConnectionString: mongo,
    });

    client.on("voiceStateUpdate", (oldState, newState) => {
      voiceClient.startListener(oldState, newState);
    })

    const embed = await voiceClient.generateLeaderboard({
      guild: interaction.guild,
      message: interaction,
      top: 10,
    });

    interaction.followUp({ embeds: [embed] });
  },
};