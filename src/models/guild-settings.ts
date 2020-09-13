import {Table, Column, PrimaryKey, Model, HasMany} from 'sequelize-typescript';
import Site from './site';

@Table
export default class GuildSettings extends Model<GuildSettings> {
  @PrimaryKey
  @Column
  guildId!: string;

  @Column
  prefix!: string;

  @HasMany(() => Site, 'guildId')
  sites!: Site[];
}
