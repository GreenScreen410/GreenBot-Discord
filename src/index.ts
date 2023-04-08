import "dotenv/config";
import Handler from "./handler/index.js";
import { Client, Collection } from "discord.js";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, any>;
    buttons: Collection<string, any>;
  }
}

const client = new Client({ intents: 32767 });

export default client;

client.commands = new Collection();
client.buttons = new Collection();

Handler(client);

client.login(process.env.BETA_TOKEN);
