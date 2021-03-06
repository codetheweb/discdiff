import {Message} from 'discord.js';
import {injectable} from 'inversify';
import Command from '.';
import {GuildSettings} from '../models';

@injectable()
export default class implements Command {
  public name = 'list';
  public aliases = ['ls'];
  public examples = [
    ['list', 'shows all active sites']
  ];

  public async execute(msg: Message, _: string [], guildSettings: GuildSettings): Promise<void> {
    const sites = await guildSettings.$get('sites');

    if (sites.length === 0) {
      throw new Error('not currently watching any sites');
    }

    let list = '';

    sites.forEach(site => {
      list += `sending updates for <${site.address}> in <#${site.channelId}> using \`${site.selector}\`\n`;
    });

    await msg.channel.send(list);
  }
}
