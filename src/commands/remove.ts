import {Message} from 'discord.js';
import {injectable} from 'inversify';
import Command from '.';
import {Site, GuildSettings} from '../models';

@injectable()
export default class implements Command {
  public name = 'remove';
  public aliases = ['rm'];
  public examples = [
    ['add #announcements https://example.com #main > .content', 'you don\'t need a description']
  ];

  public async execute(msg: Message, args: string [], guildSettings: GuildSettings): Promise<void> {
    if (!args[0]) {
      throw new Error('need to call remove with an address');
    }

    console.log({where: {address: args[0], guildId: guildSettings.guildId}});

    const site = await Site.findOne({where: {address: args[0], guildId: guildSettings.guildId}});

    if (!site) {
      throw new Error('address not found');
    }

    await site.destroy();

    await msg.channel.send('👍 removed');
  }
}
