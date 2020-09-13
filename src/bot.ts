import {Client, Message, Collection} from 'discord.js';
import {inject, injectable} from 'inversify';
import {TYPES} from './types';
import {GuildSettings} from './models';
import container from './inversify.config';
import Command from './commands';
import debug from './utils/debug';
import handleGuildCreate from './events/guild-create';
import errorMsg from './utils/error-msg';

@injectable()
export default class {
  private readonly client: Client;
  private readonly token: string;
  private readonly clientId: string;
  private readonly commands!: Collection<string, Command>;

  constructor(@inject(TYPES.Client) client: Client, @inject(TYPES.Config.DISCORD_TOKEN) token: string, @inject(TYPES.Config.DISCORD_CLIENT_ID) clientId: string) {
    this.client = client;
    this.token = token;
    this.clientId = clientId;
    this.commands = new Collection();
  }

  public async listen(): Promise<string> {
    // Load in commands
    container.getAll<Command>(TYPES.Command).forEach(command => {
      const commandNames = [command.name, ...command.aliases];

      commandNames.forEach(commandName => this.commands.set(commandName, command));
    });

    this.client.on('message', async (msg: Message) => {
      // Get guild settings
      if (!msg.guild) {
        return;
      }

      const settings = await GuildSettings.findByPk(msg.guild.id);

      if (!settings) {
        // Got into a bad state, send owner welcome message
        return this.client.emit('guildCreate', msg.guild);
      }

      const {prefix} = settings;

      if (!msg.content.startsWith(prefix) || msg.author.bot) {
        return;
      }

      let args = msg.content.slice(prefix.length).split(/ +/);
      const command = args.shift()!.toLowerCase();

      let handler: Command;

      if (this.commands.has(command)) {
        handler = this.commands.get(command) as Command;
      } else {
        return;
      }

      try {
        await handler.execute(msg, args, settings);
      } catch (error) {
        debug(error);
        await msg.channel.send(errorMsg((error as Error).message.toLowerCase()));
      }
    });

    this.client.on('ready', async () => {
      console.log(`Ready! Invite the bot with https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&permissions=150592&scope=bot`);

      container.bind<Client>(TYPES.DiscordClient).toConstantValue(this.client);
    });

    this.client.on('error', console.error);
    this.client.on('debug', debug);

    // Register event handlers
    this.client.on('guildCreate', handleGuildCreate);

    return this.client.login(this.token);
  }
}
