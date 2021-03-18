import { Common } from '../models/Common.model';
import { Field, Int, ObjectType } from 'type-graphql';
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';
import * as uuid from 'uuid';

@ObjectType()
@Entity()
export class Item extends Common {
  @Field()
  @PrimaryColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field()
  @Column()
  imageurl: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.items)
  user: User;

  @BeforeInsert()
  addId(): void {
    this.id = uuid.v4();
  }
}
