import {Guild} from 'discord.js';
import {GuildSettings} from '../models';

const DEFAULT_PREFIX = ',';

export default async (guild: Guild): Promise<void> => {
  await GuildSettings.upsert({guildId: guild.id, prefix: DEFAULT_PREFIX});

  const owner = await guild.client.users.fetch(guild.ownerID);

  const welcomeMsg = '👋 Hi!\n';

  await owner.send(welcomeMsg);
};
