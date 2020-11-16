import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MESSAGES } from '../actions/requests';
import { Container, Message } from 'semantic-ui-react';

const messageStyles = {
  maxWidth: '50%',
  overflowWrap: 'break-word',
  border: 'red',
};

const userMessageStyles = {
  alignSelf: 'flex-end',
};

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
};

const Messages = ({ user }) => {
  const { data } = useQuery(GET_MESSAGES);
  if (!data) return null;
  return (
    <Container style={containerStyles}>
      {data.messages.map(({ id, username, content }) => {
        const isUser = username === user;
        const messageAlign = isUser ? 'flex-end' : 'flex-start';

        return (
          <Message
            key={id}
            compact
            color={isUser ? 'blue' : 'grey'}
            style={{ ...messageStyles, alignSelf: messageAlign }}
          >
            <Message.Header>{username}</Message.Header>
            {content}
          </Message>
        );
      })}
    </Container>
  );
};

export default Messages;
