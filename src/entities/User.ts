import { Common } from '../models/Common.model';
import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Item } from './Item';
import * as uuid from 'uuid';

@ObjectType()
@Entity()
export class User extends Common {
  @Field()
  @PrimaryColumn('uuid')
  id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Field(() => [Item])
  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @BeforeInsert()
  addId(): void {
    this.id = uuid.v4();
  }

  static findByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('user').where('user.email = :email', { email }).getOne();
  }
}
