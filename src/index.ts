import makeDir from 'make-dir';
import container from './inversify.config';
import {TYPES} from './types';
import Bot from './bot';
import {sequelize} from './utils/db';

let bot = container.get<Bot>(TYPES.Bot);

(async () => {
  // Create data directories if necessary
  await makeDir(container.get(TYPES.Config.DATA_DIR));

  await sequelize.sync({});

  await bot.listen();
})();
