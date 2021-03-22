import { ItemInput } from '../inputs/itemInput';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AppContext } from '../types/context';
import { User } from '@entities/User';
import { Item } from '@entities/Item';

@Resolver()
export class ItemResolver {
  @Mutation(() => Item)
  async createItem(@Arg('data') data: ItemInput, @Ctx() { req }: AppContext): Promise<Item> {
    if (!req.session.userId) {
      throw new Error('You are not authorized to perform this action');
    }

    const user = await User.findOne({
      where: {
        id: req.session.userId,
      },
    });

    const item = await Item.create({
      name: data.name,
      price: data.price,
      imageurl: data.imageurl,
      description: data.description,
      quantity: data.quantity,
      user: user,
    }).save();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.items = [];

    user?.items.push(item);

    return item;
  }

  // TODO: Add pagination and write a dataloader for this query
  @Query(() => [Item])
  async fetchItems(): Promise<Item[]> {
    // would be more efficient with a dataloader but for demo it'll work
    const items = await Item.find({
      relations: ['user'],
    });

    return items;
  }
}
