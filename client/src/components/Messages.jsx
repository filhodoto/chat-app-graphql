import React from 'react';
import PropTypes from 'prop-types';
import { useSubscription } from '@apollo/client';
import { GET_MESSAGES } from '../actions/requests';
import { Container, Segment, Label } from 'semantic-ui-react';

const messageStyles = {
  maxWidth: '50%',
  overflowWrap: 'break-word',
};

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
};

const Messages = ({ currentUser }) => {
  const { data } = useSubscription(GET_MESSAGES);
  if (!data) return null;

  return (
    <Container style={containerStyles}>
      {data.messages.map(({ id, username, content }) => {
        const isUser = username === currentUser;
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
            <p>{content}</p>
          </Segment>
        );
      })}
    </Container>
  );
};

Messages.propTypes = {
  currentUser: PropTypes.string.isRequired,
};

export default Messages;
