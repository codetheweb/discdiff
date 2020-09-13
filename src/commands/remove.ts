import {Message} from 'discord.js';
import {injectable, inject} from 'inversify';
import Command from '.';
import {Site, GuildSettings} from '../models';
import Queue from '../services/queue';
import {TYPES} from '../types';

@injectable()
export default class implements Command {
  @inject(TYPES.Queue) private readonly queue!: Queue;

  public name = 'remove';
  public aliases = ['rm'];
  public examples = [
    ['remove https://example.com', 'removes https://example.com']
  ];

  public async execute(msg: Message, args: string [], guildSettings: GuildSettings): Promise<void> {
    if (!args[0]) {
      throw new Error('need to call remove with an address');
    }

    const site = await Site.findOne({where: {address: args[0], guildId: guildSettings.guildId}});

    if (!site) {
      throw new Error('address not found');
    }

    await site.destroy();

    this.queue.remove(site.id);

    await msg.channel.send('👍 removed');
  }
}
