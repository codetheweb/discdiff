import {Guild} from 'discord.js';
import {GuildSettings} from '../models';

const DEFAULT_PREFIX = ',';

export default async (guild: Guild): Promise<void> => {
  await GuildSettings.upsert({guildId: guild.id, prefix: DEFAULT_PREFIX});

  const owner = await guild.client.users.fetch(guild.ownerID);

  let welcomeMsg = '👋 Hi!\n';
  welcomeMsg += 'My default prefix is `,`. Try sending ,help in your server to get usage information.';

  await owner.send(welcomeMsg);
};
