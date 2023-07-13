import { objectType, extendType, nonNull, stringArg } from 'nexus';
import { v4 as uuid } from 'uuid';

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('description');
    t.nonNull.string('url');
    t.nonNull.string('linkStatus');
    t.field('postedBy', {
      type: 'User',
      resolve(parent, args, context) {
        return context.prismaClient.link
          .findUnique({
            where: { id: parent.id },
          })
          .postedBy();
      },
    });
  },
});

const emptyLink = {
  id: '',
  description: 'Link not found',
  url: 'Link not found',
  linkStatus: 'Link not found',
};

export const LinksQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('feed', {
      type: 'Link',
      async resolve(parent, args, context, info) {
        return await context.prismaClient.link.findMany();
      },
    });
  },
});

export const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('link', {
      type: 'Link',
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(parent, args, context, info) {
        const { id } = args;
        const foundLink = await context.prismaClient.link.findUnique({
          where: { id: id },
        });

        return foundLink || null;
      },
    });
  },
});

export const LinkPostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('post', {
      type: 'Link',
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error('Cannot post without logging in');
        }

        const newLink = await context.prismaClient.link.create({
          data: {
            id: uuid(),
            description: description,
            url: url,
            linkStatus: 'ACTIVE',
            postedBy: { connect: { id: userId } },
          },
        });

        return newLink;
      },
    });
  },
});

export const LinkDeleteMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteLink', {
      type: 'Link',
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { id } = args;

        const newFoundLink = await context.prismaClient.link.delete({
          where: { id: id },
        });

        return newFoundLink || { ...emptyLink, id: id };
      },
    });
  },
});

export const LinkUpdateMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateLink', {
      type: 'Link',
      args: {
        id: nonNull(stringArg()),
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { id, description, url } = args;

        const newFoundLink = await context.prismaClient.link.update({
          where: { id: id },
          data: {
            description: description,
            url: url,
            linkStatus: 'UPDATED',
          },
        });

        return newFoundLink || { ...emptyLink, id: id };
      },
    });
  },
});
