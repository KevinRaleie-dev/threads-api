import { Field, InputType } from "type-graphql";

@InputType({description: 'Login user data'})
export class LoginUserInput {

    @Field()
    email: string;

    @Field()
    password: string;
}