import { GraphQLServer, PubSub } from 'graphql-yoga';

// Empty array we will fill with the messages
let messages = [];

// List of subscribers to our messages
const subscribers = [];

// List of users in our app
let users = [];

// Action to do when we update messages
const onMessagesUpdates = (fn) => subscribers.push(fn);

// Define GraphQL type definitions
const typeDefs = `
    type Message {
        id: ID!
        username: String!
        content: String!
    }

    type User {
      key: String!  
      username: String!
      text: String!
    }

    type Query {
        messages: [Message!]
        users: [User!]
    }

    type Subscription {
      messages: [Message!]
    }

    type Mutation {
      "Adds message to messages array"
      postMessage(username: String!, content: String!): ID!
      "Add user to users array"
      addUser(username: String!): String!
      "Delete all users"
      deleteAllUsers: String!
      "Delete all messages"
      deleteAllMessages: String!
    }
`;

// Define how we are gonna get the data
const resolvers = {
  Query: { messages: () => messages, users: () => users },
  Mutation: {
    postMessage: (parent, { username, content }) => {
      // Create and ID based on messages length (which won't be repeat)
      const id = messages.length;

      // Add message to messages array
      messages.push({ id, username, content });

      // Itereate all the subscribers and call the callback function for each one
      // Note: without this the subscibers don't update when we push a message to messages array
      subscribers.forEach((fn) => fn());

      return id;
    },
    addUser: (parent, { username }) => {
      const key = username.split(' ')[0].toLowerCase();
      const text = username.replace(/^\w/, (c) => c.toUpperCase());

      // Add user to users arrays
      users.push({ key, username, text });

      return username;
    },
    deleteAllUsers: (parent) => {
      users = [];
      return 'all users deleted';
    },
    deleteAllMessages: (parent) => {
      messages = [];
      return 'all messages deleted';
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        // Create random channel
        const channel = Math.random().toString(36).slice(2, 15);

        // Subscribe channel with the content of our messages to subscribers list
        onMessagesUpdates(() => pubsub.publish(channel, { messages }));

        // Send the data after we subscribe so we can see the new messages right after sending hit
        // Note: If we don't do this will only see the first message when we send the second one
        setTimeout(() => {
          pubsub.publish(channel, { messages });
        }, 0);

        // GraphQL engine knows that messages is a subscription, and every time we use pubsub.publish over this topic
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

// Create new Subscriptions Publication
// https://github.com/apollographql/graphql-subscriptions
const pubsub = new PubSub();

// Create new server
// Pass pubsub  as context
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.start(({ port }) => {
  console.log(`Server started at http://localhost:${port}/`);
});
