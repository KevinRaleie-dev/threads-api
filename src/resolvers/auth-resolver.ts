import { User } from '@entities/User';
import bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import { RegisterUserInput } from '../inputs/registerInput';
import { LoginUserInput } from '../inputs/loginInput';
import { AuthResponse } from '../responses/authResponse';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { AppContext } from '../types/context';
import { validationSchema } from '../responses/validation-schema';
import { FORGOT_PASSWORD } from '../utils/constants';
import { sendForgotPasswordEmail } from '../utils/sendEmails';
import { sanitize } from '../utils/sanitze';
import { createAccessToken } from '../utils/token';

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

    const sanitizedEmail = sanitize(data.email);
    const sanitizedUsername = sanitize(data.username);

    // This is two sql commands
    const user = await User.create({
      email: sanitizedEmail,
      username: sanitizedUsername,
      password: hashPassword,
    }).save();

    return {
      user,
    };
  }

  @Mutation(() => AuthResponse, { nullable: true })
  async login(@Arg('data') data: LoginUserInput, @Ctx() { req }: AppContext): Promise<AuthResponse | undefined> {
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

    switch (data.platform) {
      case 'Web': // if user logs in from the web, issue a cookie
        req.session.userId = user.id;
        return {
          user,
        };
        break;
      case 'Mobile': // if user logs in from mobile, issue a token
        return {
          user,
          accessToken: createAccessToken(user),
        };
        break;
      default:
        return undefined;
        break;
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: AppContext): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err: unknown) => {
        if (err) {
          resolve(false);
          return;
        }

        res.clearCookie('cid');
        resolve(true);
      });
    });
  }

  @Mutation(() => AuthResponse)
  async forgotPassword(@Arg('email') email: string, @Ctx() { redis }: AppContext): Promise<AuthResponse> {
    // find the user
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Sorry this account does not exist.',
          },
        ],
      };
    }

    // create token and store in redis
    // create link with the token
    // send email to user with generated token

    const generatedToken = uuid.v4();

    await redis.set(
      FORGOT_PASSWORD + generatedToken,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 1, // a day
    );

    // use this to send email on testing only, use sendgrid in prod
    await sendForgotPasswordEmail(
      email,
      `<a href="http://localhost:8080/change-password/${generatedToken}">Reset password</a>`,
    );

    return {
      user,
    };
  }

  @Mutation(() => AuthResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis }: AppContext,
  ): Promise<AuthResponse> {
    try {
      await validationSchema.validate({ password: newPassword });
    } catch (error) {
      if (error.message.includes('password')) {
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

    // get the token from redis
    const key = FORGOT_PASSWORD + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      };
    }

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'This user no longer exists.',
          },
        ],
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await User.update(
      {
        id: userId,
      },
      {
        password: hash,
      },
    );

    await redis.del(key);

    // would log in the user here but just gonna return the user and reroute them to the login page
    return {
      user,
    };
  }
}
