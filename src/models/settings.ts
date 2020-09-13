import {Table, Column, PrimaryKey, Model} from 'sequelize-typescript';

@Table
export default class Settings extends Model<Settings> {
  @PrimaryKey
  @Column
  guildId!: string;

  @Column
  prefix!: string;
}
