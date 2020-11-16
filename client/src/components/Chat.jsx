import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Messages from './Messages';
import { Container, Divider, Header } from 'semantic-ui-react';
// Create GraphQL client
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

const styles = {
  mainContainer: {
    padding: '20px 0',
  },
};

const Chat = () => {
  return (
    <Container style={styles.mainContainer}>
      <Header content="Let's talk about ...  baby, let's talk about you and me " />
      <Divider />
      <Messages user='Zar' />
    </Container>
  );
};

// export default Chat;
export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
