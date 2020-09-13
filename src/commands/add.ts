import {Message, GuildChannel} from 'discord.js';
import {injectable, inject} from 'inversify';
import cheerio from 'cheerio';
import got from 'got';
import Command from '.';
import Queue from '../services/queue';
import {Site, GuildSettings} from '../models';
import {TYPES} from '../types';

@injectable()
export default class implements Command {
  @inject(TYPES.Queue) private readonly queue!: Queue;

  public name = 'add';
  public aliases = ['a'];
  public examples = [
    ['add #announcements https://example.com #main > .content', 'you don\'t need a description']
  ];

  public async execute(msg: Message, args: string [], guildSettings: GuildSettings): Promise<void> {
    if (args.length < 3) {
      throw new Error('not enough arguments');
    }

    // Get channel
    let channel: GuildChannel | undefined;

    const possibleChannelId = args[0];

    if (possibleChannelId.startsWith('<#')) {
      // Discord-style mention
      channel = msg.guild?.channels.cache.find(channel => channel.id === possibleChannelId.slice(2, possibleChannelId.length - 1));
    } else {
      const sliced = possibleChannelId.startsWith('#') ? possibleChannelId.slice(1) : possibleChannelId;

      channel = msg.guild?.channels.cache.find(channel => channel.name === sliced);
    }

    if (!channel) {
      throw new Error('channel not found');
    }

    if (channel.type !== 'text') {
      throw new Error('must use a text channel');
    }

    // Make sure site is reachable
    const address = args[1];

    let siteContent;

    try {
      siteContent = (await got(address)).body;
    } catch {
      throw new Error('site not reachable');
    }

    // Compute selector
    const selector = args.slice(2).join(' ');

    const site = new Site({
      address,
      selector,
      lastContent: cheerio.load(siteContent)(selector).html() ?? '',
      channelId: channel.id,
      guildId: guildSettings.guildId
    });

    await site.save();

    this.queue.add(site.id);

    await msg.channel.send('👍 added');
  }
}
