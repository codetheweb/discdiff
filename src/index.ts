import makeDir from 'make-dir';
import container from './inversify.config';
import {TYPES} from './types';
import Bot from './bot';
import Queue from './services/queue';
import {sequelize} from './utils/db';

let bot = container.get<Bot>(TYPES.Bot);
let queue = container.get<Queue>(TYPES.Queue);

(async () => {
  // Create data directories if necessary
  await makeDir(container.get(TYPES.Config.DATA_DIR));

  await sequelize.sync({});

  await bot.listen();

  await queue.addFromDatabase();
})();
