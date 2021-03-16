import { Field, InputType } from 'type-graphql';
import { User } from '../entities/User';

@InputType({ description: 'Login user data' })
export class LoginUserInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}
