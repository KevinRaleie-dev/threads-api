import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './Item';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

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

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  static findByEmail(email: string) {
    return this.createQueryBuilder('user').where('user.email = :email', { email }).getOne();
  }
}
