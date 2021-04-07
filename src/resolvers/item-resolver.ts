import { ItemInput } from '../inputs/itemInput';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AppContext } from '../types/context';
import { User } from '@entities/User';
import { Item } from '@entities/Item';
import { isAuth } from '../middleware/isAuth';

@Resolver()
export class ItemResolver {
  @Mutation(() => Item)
  @UseMiddleware(isAuth)
  async createItem(@Arg('data') data: ItemInput, @Ctx() { req }: AppContext): Promise<Item> {
    // There needs to be some sort of validation for adding an item, at moment i can create an item with empty fields
    // and a quantity and price of negative something
    // so mostly all of these fields would need to be required, validated and sanitized
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
