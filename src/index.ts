import { ApolloServer } from 'apollo-server';
// import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { schema } from './schema';
import { context } from './context';

export const server = new ApolloServer({
  schema,
  context,
  // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const port = 3001;

server.listen({ port }).then(({ url }) => {
  console.log(`Server is running on ${url}`);
});
