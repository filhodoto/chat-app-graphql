import { GraphQLServer } from 'graphql-yoga';

// Empty array we will fill with the messages
const messages = [];

// Define GraphQL type definitions
const typeDefs = `
    type Message {
        id: ID!
        username: String!
        content: String!
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
      "Adds message to messages array"
      postMessage(username: String!, content: String!): ID!
    }
`;

// Define how we are gonna get the data
const resolvers = {
  Query: { messages: () => messages },
  Mutation: {
    postMessage: (parent, { username, content }) => {
      // Create and ID based on messages length (which won't be repeat)
      const id = messages.length;

      const message = { id, username, content };

      // Add message to messages array
      messages.push(message);

      return id;
    },
  },
};

// Create new server
const server = new GraphQLServer({ typeDefs, resolvers });

server.start(({ port }) => {
  console.log(`Server started at http://localhost:${port}/`);
});
