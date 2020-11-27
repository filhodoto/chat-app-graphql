import React, { useEffect, useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useMutation,
  useQuery,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Dimmer, Loader } from 'semantic-ui-react';
import styled, { keyframes } from 'styled-components';
import { GET_USERS, ADD_USER } from '../actions/requests';
import AddUserModal from './AddUserModal';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import ChatConversation from './ChatConversation';

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

// Create background animation
const gradient = keyframes`
  0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const Container = styled.div`
  height: 100%;
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: linear-gradient(
    -45deg,
    #e5e5e5,
    #c6c9ce,
    #a3aeb6,
    #7e969c,
    #f2ecff
  );
  background-size: 400% 400%;
  animation: ${gradient} 8s ease infinite;
`;

const Chat = () => {
  const [state, setState] = useState({
    loggedUser: null,
    usersList: [],
    modalOpen: false,
    fetchDataOnLoad: false,
  });

  const { loading, data, refetch } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER);

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

  // Handle User change
  const handleUserChange = (ev, data) =>
    setState({ ...state, loggedUser: data.username });

  const addNewUser = (username) => {
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
        <Container>
          <AddUserModal modalOpen={state.modalOpen} callbackFunc={addNewUser} />
          <ChatHeader loggedUser={state.loggedUser} callbackFunc={addNewUser} />
          <ChatConversation
            loggedUser={state.loggedUser}
            usersList={state.usersList}
          />
          {state.loggedUser && (
            <ChatFooter
              handleUserChange={handleUserChange}
              loggedUser={state.loggedUser}
              usersList={state.usersList}
            />
          )}
        </Container>
      )}
    </>
  );
};

// export default Chat;
export default function ChatWithApollo() {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
}
