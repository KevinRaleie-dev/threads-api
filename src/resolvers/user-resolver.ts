import { AppContext } from '../types/context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '@entities/User';
import { getConnection } from 'typeorm';
import { isAuth } from '../middleware/isAuth';

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateUserImage(@Ctx() { req }: AppContext, @Arg('imgUrl') imgUrl: string): Promise<boolean> {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ imageUrl: imgUrl })
      .where('id = :id', { id: req.session.userId })
      .execute();

    return true;
  }

  @Query(() => User, { nullable: true })
  async getUserByUsername(@Arg('username') username: string): Promise<User | null> {
    const findUserByUsername = await User.findOne({
      relations: ['items'],
      where: {
        username: username,
      },
    });

    if (!findUserByUsername) {
      return null;
    }

    return findUserByUsername;
  }
}
