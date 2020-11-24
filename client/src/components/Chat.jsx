import React, { useEffect, useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useMutation,
  useQuery,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import Messages from './Messages';
import {
  Button,
  Dimmer,
  Dropdown,
  Form,
  Header,
  Icon,
  Input,
  Loader,
  Segment,
} from 'semantic-ui-react';

import {
  SEND_MESSAGES,
  GET_USERS,
  ADD_USER,
  DELETE_ALL_USERS,
  DELETE_ALL_MESSAGES,
} from '../actions/requests';
import AddUserModal from './AddUserModal';

// Initialize a WebSocketLink (this needs to be called link)
// https://www.apollographql.com/docs/link/links/ws/#options
const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

// Create GraphQL client
const client = new ApolloClient({
  link,
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

const Chat = () => {
  const [state, setState] = useState({
    loggedUser: null,
    messageContent: '',
    usersList: [],
    modalOpen: false,
    fetchDataOnLoad: false,
  });

  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [postMessage] = useMutation(SEND_MESSAGES);
  const [addUser] = useMutation(ADD_USER);
  const [deleteAllUsers] = useMutation(DELETE_ALL_USERS);
  const [deleteAllMessages] = useMutation(DELETE_ALL_MESSAGES);

  useEffect(() => {
    if (!loading) {
      // When we get the data for the first time populate state with values from query
      if (!state.loggedUser && !state.fetchDataOnLoad) {
        // If we have users
        if (data.users.length > 0) {
          setState({
            ...state,
            loggedUser: data.users[0].text,
            usersList: data.users,
            fetchDataOnLoad: true,
          });
        } else {
          // If we don't have users show modal
          setState({
            ...state,
            modalOpen: true,
            fetchDataOnLoad: true,
          });
        }
      }

      // If the users number change
      if (
        data.users.length !== state.usersList.length &&
        data.users.length > 0
      ) {
        // Update users list in state
        setState({
          ...state,
          usersList: data.users,
          modalOpen: false,
        });
      }

      // If we have users but we don't have a loggedUsername
      if (!state.loggedUser && data.users.length > 0) {
        // Set loggedUsername to first in
        setState({
          ...state,
          loggedUser: data.users[0].text,
        });
      }
    }

    return () => {};
  }, [data, state, loading]);

  // Handle form submit
  const handleFormSubmit = (ev) => {
    ev.preventDefault();

    if (state.messageContent.length > 0) {
      // Send message
      postMessage({
        variables: {
          username: state.loggedUser,
          content: state.messageContent,
        },
      });
      // Clear state messageContent
      setState({ ...state, messageContent: '' });
    }
  };

  // Handle User change
  const handleUserChange = (ev, value) => {
    setState({ ...state, loggedUser: value.name });
  };

  // Handle Input change
  const handleInputChange = (ev, value) => {
    setState({ ...state, messageContent: value.value });
  };

  const onUserAdded = (username) => {
    // Add new user to server
    addUser({ variables: { username: username } });

    // Refectch users
    // Note:: There are better ways of doing this, like using subscription instead of query for users
    refetch();
  };

  return (
    <>
      {loading ? (
        <Dimmer active>
          <Loader content='Loading' />
        </Dimmer>
      ) : (
        <div
          style={{
            height: '100%',
            padding: '20px',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
          }}
        >
          <AddUserModal
            modalOpen={state.modalOpen}
            callbackFunc={onUserAdded}
          />
          <Header attached='top' size='large'>
            <Icon name='chat' size='large' />
            {state.loggedUser && (
              <Header.Content>Logged in as {state.loggedUser}</Header.Content>
            )}
            <Button.Group basic size='mini'>
              <Button onClick={deleteAllUsers}>Clear users</Button>
              <Button onClick={deleteAllMessages}>delete messages</Button>
            </Button.Group>
          </Header>
          <Segment
            placeholder
            attached
            style={{
              overflow: 'hidden',
            }}
          >
            {state.loggedUser && (
              <Messages
                currentUser={state.loggedUser}
                usersList={state.usersList}
              />
            )}
          </Segment>
          {state.loggedUser && (
            <>
              <Dropdown
                labeled
                // button
                icon='user'
                className='icon'
                floating
                // defaultValue={state.loggedUser}
                // options={usersList}
                // onChange={handleUserChange}
              >
                <Dropdown.Menu>
                  {state.usersList.map((user) => (
                    <Dropdown.Item
                      onClick={(ev, value) => handleUserChange(ev, value)}
                      key={user.key}
                      text={user.text}
                      {...user}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
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
                  value={state.messageContent}
                  onChange={handleInputChange}
                >
                  <input />
                  <Button
                    type='submit'
                    basic
                    icon
                    labelPosition='left'
                    color='blue'
                  >
                    <Icon name='send' />
                    Send
                  </Button>
                </Input>
              </Form>
            </>
          )}
        </div>
      )}
    </>
  );
};

// export default Chat;
export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
