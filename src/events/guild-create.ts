import {Guild} from 'discord.js';
import {Settings} from '../models';

const DEFAULT_PREFIX = ',';

export default async (guild: Guild): Promise<void> => {
  await Settings.upsert({guildId: guild.id, prefix: DEFAULT_PREFIX});

  const owner = await guild.client.users.fetch(guild.ownerID);

  const welcomeMsg = '👋 Hi!\n';

  await owner.send(welcomeMsg);
};
