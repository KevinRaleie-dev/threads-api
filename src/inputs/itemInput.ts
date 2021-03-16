import { Field, InputType, Int } from 'type-graphql';
import { Item } from '../entities/Item';

@InputType()
export class ItemInput implements Partial<Item> {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  imageurl: string;

  @Field()
  description: string;

  @Field(() => Int)
  quantity: number;
}
