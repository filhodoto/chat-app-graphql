import React, { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useMutation,
} from '@apollo/client';
import Messages from './Messages';
import {
  Button,
  Container,
  Dropdown,
  Form,
  Header,
  Icon,
  Input,
  Segment,
} from 'semantic-ui-react';

import { SEND_MESSAGES } from '../actions/requests';
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
  const colors = ['teal', 'violet', 'olive', 'yellow', 'purple'];

  const [state, setState] = useState({ username: 'Ramalho', content: '' });
  const [usersList, setUsersList] = useState([
    { name: 'Ramalho', color: colors[0] },
  ]);
  const [postMessage] = useMutation(SEND_MESSAGES);

  const dummyUserList = [
    { key: 'Zar', value: 'Zar', text: 'Zar' },
    { key: 'Ramalho', value: 'Ramalho', text: 'Ramalho' },
    { key: 'Carrilho', value: 'Carrilho', text: 'Carrilho' },
  ];

  // Handle form submit
  const handleFormSubmit = (ev) => {
    ev.preventDefault();
    if (state.content.length > 0) {
      // Check if user is already in users list and if he has color
      if (usersList.find((el) => el.key === state.username)) {
        console.log('User already has color');
      } else {
        setUsersList([
          ...usersList,
          { name: state.username, color: colors[usersList.length] },
        ]);
      }
      console.log('form submit');
      // Send message
      postMessage({ variables: state });
      // Clear state content
      setState({ ...state, content: '' });
    }
  };

  // Handle User change
  const handleUserChange = (ev, value) => {
    setState({ ...state, username: value.value });
  };

  // Handle Input change
  const handleInputChange = (ev, value) => {
    setState({ ...state, content: value.value });
  };

  return (
    <Container style={styles.mainContainer}>
      <Header attached='top' size='large'>
        <Icon name='chat' size='large' />
        <Header.Content>
          Let's talk about ... baby, let's talk about you and me
        </Header.Content>
      </Header>
      <Segment placeholder attached>
        <Messages user={state.username} />
      </Segment>
      <Form
        style={{ padding: '20px 0px 0' }}
        onSubmit={handleFormSubmit}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            handleFormSubmit;
          }
        }}
      >
        <Input
          type='text'
          placeholder='Whats on your mind...'
          action
          fluid
          value={state.content}
          onChange={handleInputChange}
        >
          <Dropdown
            button
            basic
            floating
            options={dummyUserList}
            defaultValue={state.username}
            onChange={handleUserChange}
          />
          <input />
          <Button type='submit' basic icon labelPosition='left' color='blue'>
            <Icon name='send' />
            Send
          </Button>
        </Input>
      </Form>
    </Container>
  );
};

// export default Chat;
export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
