import { Field } from 'type-graphql';
import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Common extends BaseEntity {
  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
