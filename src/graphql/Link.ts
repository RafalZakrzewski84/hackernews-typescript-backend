import { objectType, extendType, nonNull, stringArg } from 'nexus';
import { NexusGenObjects, NexusGenFieldTypes } from '../../nexus-typegen';
import { v4 as uuidv4 } from 'uuid';

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('description');
    t.nonNull.string('url');
    t.nonNull.string('linkStatus');
  },
});

let links: NexusGenObjects['Link'][] = [
  {
    id: uuidv4(),
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
    linkStatus: 'ACTIVE',
  },
  {
    id: uuidv4(),
    url: 'graphql.org',
    description: 'GraphQL official website',
    linkStatus: 'ACTIVE',
  },
];

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
      resolve(parent, args, context, info) {
        return links;
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
      resolve(parent, args, context, info) {
        const { id } = args;
        const foundLink = links.find(link => link.id === id);

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
      resolve(parent, args, context) {
        const { description, url } = args;

        const link = {
          id: uuidv4(),
          description: description,
          url: url,
          linkStatus: 'ACTIVE',
        };

        links.push(link);

        return link;
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
      resolve(parent, args, context) {
        const { id } = args;

        let foundLink = links.find(link => link.id === id);

        if (foundLink) {
          links = links.map(link =>
            link.id === id ? { ...link, linkStatus: 'DELETED' } : link
          );
          foundLink = links.find(link => link.id === id);
        }

        return foundLink || {...emptyLink, id: id};
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
      resolve(parent, args, context) {
        const { id, description, url } = args;

        let foundLink = links.find(link => link.id === id);

        if (foundLink) {
          links = links.map(link =>
            link.id === id
              ? {
                  ...link,
                  description: description,
                  url: url,
                  linkStatus: 'UPDATED',
                }
              : link
          );
          foundLink = links.find(link => link.id === id);
        }

        return foundLink ||  {...emptyLink, id: id};
      },
    });
  },
});
