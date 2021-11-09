import { Field, InputType } from 'type-graphql';
import { User } from '../entities/User';

@InputType({
  description: 'Login user data and specify with platform they are loggin in from.',
})
export class LoginUserInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => String, { description: 'Platform the user is logging in from. eg: Mobile or Web' })
  platform: 'Web' | 'Mobile';
}
