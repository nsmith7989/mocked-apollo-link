import { buildSchema, graphqlSync, introspectionQuery } from 'graphql';

const sdl = `
type Author {
  id: Int!
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}
type Query {
  posts: [Post]
  author(id: Int!): Author
}
`;

const graphqlSchemaObject = buildSchema(sdl);
const introspectionResult = graphqlSync(graphqlSchemaObject, introspectionQuery).data;

export { introspectionResult };
