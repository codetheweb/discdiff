import {Sequelize} from 'sequelize-typescript';
import path from 'path';
import {DATA_DIR} from '../utils/config';
import {GuildSettings} from '../models';
import {Site} from '../models';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  database: 'muse',
  storage: path.join(DATA_DIR, 'db.sqlite'),
  models: [GuildSettings, Site],
  logging: false
});
