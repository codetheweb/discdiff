import 'reflect-metadata';
import {Container} from 'inversify';
import {TYPES} from './types';
import Bot from './bot';
import Command from './commands';
import {Client} from 'discord.js';
import {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DATA_DIR
} from './utils/config';

import Add from './commands/add';
import Help from './commands/help';
import List from './commands/list';

let container = new Container();

// Bot
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());

// Commands
[
  Add,
  Help,
  List
].forEach(command => {
  container.bind<Command>(TYPES.Command).to(command).inSingletonScope();
});

// Config values
container.bind<string>(TYPES.Config.DISCORD_TOKEN).toConstantValue(DISCORD_TOKEN);
container.bind<string>(TYPES.Config.DISCORD_CLIENT_ID).toConstantValue(DISCORD_CLIENT_ID);
container.bind<string>(TYPES.Config.DATA_DIR).toConstantValue(DATA_DIR);

export default container;
