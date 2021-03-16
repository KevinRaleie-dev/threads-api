import { Field, ID, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Item extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

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
    @ManyToOne(() => User, user => user.items)
    user: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;



}