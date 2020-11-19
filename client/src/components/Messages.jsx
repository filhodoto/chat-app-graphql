import React from 'react';
import PropTypes from 'prop-types';
import { useSubscription } from '@apollo/client';
import { GET_MESSAGES } from '../actions/requests';
import { Segment, Label } from 'semantic-ui-react';

const messageStyles = {
  maxWidth: '50%',
  overflowWrap: 'break-word',
};

const containerStyles = {
  display: 'flex',
  flexDirection: 'column-reverse',
  height: '100%',
  overflowY: 'scroll',
  paddingRight: '25px',
  width: 'calc(100% + 30px)',
};

// Add this div so we can see the last messages in the bottom of the container div
// https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up#comment79201655_44051405
const reverseDivStyles = {
  display: 'flex',
  flexDirection: 'column',
};

const colors = ['teal', 'violet', 'olive', 'yellow', 'purple'];

const Messages = ({ currentUser, usersList }) => {
  const { data } = useSubscription(GET_MESSAGES);
  if (!data) return null;

  return (
    <div style={containerStyles}>
      <div style={reverseDivStyles}>
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
                  color='blue'
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
      </div>
    </div>
  );
};

// Messages.propTypes = {
//   name: PropTypes.string.isRequired,
//   color: PropTypes.string.isRequired,
// };

export default Messages;
