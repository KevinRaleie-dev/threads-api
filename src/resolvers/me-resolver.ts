import { User } from '../entities/User';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AppContext } from '../types/context';
import { isAuthenticated } from '../middleware/isAuth';

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: AppContext): Promise<User | undefined> {
    // check if the user is not logged in
    if (!req.session.userId) {
      return undefined;
    }

    // if there are logged in, return the user
    const user = await User.findOne({
      relations: ['items'],
      where: {
        id: req.session.userId,
      },
    });

    return user;
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async meQuery(@Ctx() { payload }: AppContext): Promise<User | undefined> {
    const user = await User.findOne({ where: { id: payload?.id } });

    if (user) {
      return user;
    }

    return undefined;
  }
}
