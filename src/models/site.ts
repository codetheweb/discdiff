import {Table, Column, Model, DataType, BelongsTo, Default} from 'sequelize-typescript';
import GuildSettings from './guild-settings';

@Table
export default class Site extends Model<Site> {
  @Column
  address!: string;

  @Column(DataType.TEXT)
  selector!: string;

  @Column(DataType.TEXT)
  lastContent!: string;

  @Column
  channelId!: string;

  @Default(new Date())
  @Column
  lastChecked!: Date;

  @BelongsTo(() => GuildSettings, 'guildId')
  guildSettings!: GuildSettings;
}
