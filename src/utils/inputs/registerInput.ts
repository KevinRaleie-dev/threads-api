import { Field, InputType } from "type-graphql";

@InputType({description: 'Register user data'})
export class RegisterUserInput {

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;
}