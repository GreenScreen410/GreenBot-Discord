declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development';
    TOKEN: string;
    CLIENT_ID: string;
    BOT_ID: string;
    GUILD_ID: string;
    DATABASE_URL: string;
    SERVER_IP: string;
    LAVALINK_PASSWORD: string;
    THE_CAT_API_KEY: string;
    THE_DOG_API_KEY: string;
    NEIS_OPENINFO_KEY: string;
  }
}
