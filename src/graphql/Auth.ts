import { objectType, extendType, nonNull, stringArg } from 'nexus';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils/auth';
import { v4 as uuid } from 'uuid';

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('token');
    t.nonNull.field('user', { type: 'User' });
  },
});

export const AuthSignUpMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('singUp', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        name: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { email, name } = args;
        const password = await bcrypt.hash(args.password, 10);

        const user = await context.prismaClient.user.create({
          data: { id: uuid(), email, name, password },
        });

        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return {
          token,
          user,
        };
      },
    });
  },
});

export const AuthLoginMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { email, password } = args;

        const user = await context.prismaClient.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error('No such user found');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new Error('Invalid password');
        }

        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return {
          token,
          user,
        };
      
      }
    });
  },
});

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: 'User',
      resolve(parent, args, context) {
        return context.prismaClient.user.findMany();
      },
    });
  },
});
