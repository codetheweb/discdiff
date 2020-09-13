import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table
export default class Site extends Model<Site> {
  @Column
  address!: string;

  @Column
  selector!: string;

  @Column(DataType.TEXT)
  lastContent!: string;

  @Column
  channelId!: string;
}
