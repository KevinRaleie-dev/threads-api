import { Field, InputType } from "type-graphql";
import { User } from '../../entities/User';

@InputType({description: 'Register user data'})
export class RegisterUserInput implements Partial<User> {

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;
}