import { User } from '../entities/User';
import { Ctx, Query, Resolver } from 'type-graphql';
import { AppContext } from '../types/context';

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
}
