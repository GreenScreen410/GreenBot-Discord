import "dotenv/config";
import Handler from "./handler/index.js";
import { Collection } from "discord.js";
import { KoreanbotsClient } from "koreanbots";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, any>;
    buttons: Collection<string, any>;
  }
}

const client = new KoreanbotsClient({
  intents: 32767,
  koreanbots: {
    api: {
      token: `${process.env.KOREANBOTS_TOKEN}`
    }
  }, koreanbotsClient: {
    updateInterval: 600000
  }
});

export default client;

client.commands = new Collection();
client.buttons = new Collection();

Handler(client);

client.login(process.env.BETA_TOKEN);
