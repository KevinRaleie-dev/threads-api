import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { RegisterUserInput } from '../inputs/registerInput';
import { LoginUserInput } from '../inputs/loginInput';
import { AuthResponse } from '../responses/authResponse';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { AppContext } from '../types/context';
import { validationSchema } from '../responses/validation-schema';

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async register(@Arg('data') data: RegisterUserInput): Promise<AuthResponse> {
    try {
      await validationSchema.validate({ email: data.email, username: data.username, password: data.password });
    } catch (error) {
      if (error.message.includes('password') || error.message.includes('email') || error.message.includes('username')) {
        return {
          errors: [
            {
              field: error.path,
              message: error.message,
            },
          ],
        };
      }
    }

    // check if user with email exists in database
    const checkEmail = await User.findOne({
      where: {
        email: data.email,
      },
    });

    if (checkEmail) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Account already exists',
          },
        ],
      };
    }

    const checkUsername = await User.findOne({
      where: {
        username: data.username,
      },
    });

    if (checkUsername) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username already taken, try a different one',
          },
        ],
      };
    }

    // if we here, everything went well then lets hash the user's password and register them
    // i could do a bit of password validation here

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    // This is two sql commands
    const user = await User.create({
      email: data.email,
      username: data.username.toLowerCase().trim(),
      password: hashPassword,
    }).save();

    return {
      user,
    };
  }

  @Mutation(() => AuthResponse)
  async login(@Arg('data') data: LoginUserInput, @Ctx() { req }: AppContext): Promise<AuthResponse> {
    const user = await User.findByEmail(data.email);

    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Invalid email or password',
          },
        ],
      };
    }

    const valid = await bcrypt.compare(data.password, user.password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Invalid email or password',
          },
        ],
      };
    }

    // if everything matches, supply the user with a cookie

    // Add the cookie
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: AppContext) {
    return new Promise((resolve) => {
      req.session.destroy((err: any) => {
        if (err) {
          resolve(false);
          return;
        }

        res.clearCookie('cid');
        resolve(true);
      });
    });
  }
}
