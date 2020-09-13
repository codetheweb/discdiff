import {Message} from 'discord.js';
import {GuildSettings} from '../models';

export default interface Command {
  name: string;
  aliases: string[];
  examples: string[][];
  execute: (msg: Message, args: string[], guildSettings: GuildSettings) => Promise<void>;
}
