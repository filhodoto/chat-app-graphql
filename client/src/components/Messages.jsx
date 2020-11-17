import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MESSAGES } from '../actions/requests';
import { Container, Message, Segment, Header, Label } from 'semantic-ui-react';

const messageStyles = {
  maxWidth: '50%',
  overflowWrap: 'break-word',
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
          <Segment
            key={id}
            compact
            inverted
            secondary
            color={isUser ? 'blue' : 'grey'}
            style={{ ...messageStyles, alignSelf: messageAlign }}
          >
            {!isUser && (
              <Label
                as='span'
                color='teal'
                ribbon='right'
                style={{ marginBottom: '10px' }}
              >
                {username}
              </Label>
            )}
            {/* <Label attached={'top right'}>{username}</Label> */}
            <p>{content}</p>
          </Segment>
        );
      })}
    </Container>
  );
};

export default Messages;
