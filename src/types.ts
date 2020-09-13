export const TYPES = {
  Bot: Symbol('Bot'),
  Client: Symbol('Client'),
  Config: {
    DISCORD_TOKEN: Symbol('DISCORD_TOKEN'),
    DISCORD_CLIENT_ID: Symbol('DISCORD_CLIENT_ID'),
    DATA_DIR: Symbol('DATA_DIR'),
    SCRAPE_INTERVAL_S: Symbol('SCRAPE_INTERVAL_S')
  },
  Command: Symbol('Command'),
  Queue: Symbol('Queue'),
  DiscordClient: Symbol('DiscordClient')
};
