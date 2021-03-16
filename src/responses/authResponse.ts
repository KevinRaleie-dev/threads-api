import { User } from '../entities/User';
import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './onError';

@ObjectType({ description: 'Return an object of either errors or user when authenticating' })
export class AuthResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User | undefined;
}
