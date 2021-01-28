import { User } from "../entities/User";
import bcrypt from 'bcryptjs';
import { RegisterUserInput } from '../utils/inputs/registerInput';
import { LoginUserInput } from '../utils/inputs/loginInput';
import { AuthResponse } from '../utils/lib/AuthResponse';
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { AppContext } from "../utils/context";

@Resolver()
export class AuthResolver {

@Mutation(() => AuthResponse)
async register(
	@Arg('data') data: RegisterUserInput
	): Promise<AuthResponse> {
	
		// check if user with email exists
		const checkEmail = await User.findOne({where: {
			email: data.email
		}});

		if (checkEmail) {
			return {
				errors: [
					{
						field: 'email',
						message: 'User already exists'
					}
				]
			}
		}

		const checkUsername = await User.findOne({where: {
			username: data.username
		}});

		if (checkUsername) {
			return {
				errors: [
					{
						field: 'username',
						message: 'Username already taken, try a different one'
					}
			]
			}
		}

		// if we here, everything went well then lets hash the user's password and register them
		// i could do a bit of password validation here 

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(data.password, salt);

		const user = await User.create({
			email: data.email,
			username: data.username,
			password: hashPassword
		})
		.save()

		return {
			user
		}

	}


	@Mutation(() => AuthResponse)
	async login(
		@Arg('data') data: LoginUserInput,
		@Ctx() { req }: AppContext
	): Promise<AuthResponse> {

		const user = await User.findByEmail(data.email);

		if(!user) {
			return {
				errors:[
					{
						field: 'email',
						message: 'Invalid email or password'
					}
				]
			}
		}

		const valid = await bcrypt.compare(data.password, user.password);

		if(!valid) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Invalid email or password'
					}
				]
			}
		}

		// if everything matches, supply the user with a cookie

		req.session.userId = user.id;

		return {
			user
		}

	}

	@Mutation(() => Boolean)
	logout(
		@Ctx() { req, res }: AppContext
	) {
		return new Promise((resolve) => {
			req.session.destroy((err: any) => {
				if(err) {
					resolve(false);
					return;
				}

				res.clearCookie('cid');
				resolve(true);
			})
		})
	}
}