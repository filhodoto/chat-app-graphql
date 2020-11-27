import React, { useCallback, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { GET_MESSAGES } from '../actions/requests';
import { Segment, Label } from 'semantic-ui-react';
import styled from 'styled-components';

const StyledMessage = styled(Segment)`
  max-width: 50%;
  overflow-wrap: break-word;
  align-self: ${(props) => props.alignself};
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  overflow-y: scroll;
  padding-right: 25px;
  width: calc(100% + 30px);
`;

// Add this div so we can see the last messages in the bottom of the container div
// https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up#comment79201655_44051405
const ReversedContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Define colors will be using in our messages
const colors = [
  'orange',
  'violet',
  'olive',
  'yellow',
  'purple',
  'pink',
  'brown',
];

const Messages = ({ loggedUser, usersList }) => {
  const { data } = useSubscription(GET_MESSAGES);
  // Object we'll populate with a pair object with a user key and a color
  // Note: using callback beacause of this https://github.com/facebook/react/issues/14920
  const userColors = useCallback(() => {}, []);

  useEffect(() => {
    // Set a color for each user
    usersList.map((user, index) => {
      // If user already has color
      if (userColors[user.username]) return;

      // Give color according to user index and colors index
      // If we have more users then colors then choose random color instead of using user index
      const colorIndex =
        index + 1 > colors.length
          ? Math.floor(Math.random() * Math.floor(colors.length - 1))
          : index;

      userColors[user.username] = colors[colorIndex];
    });
  }, [usersList, userColors]);

  return (
    <StyledContainer>
      <ReversedContainer>
        {data &&
          data.messages.map(({ id, username, content }) => {
            const isUser = username === loggedUser;
            const messageAlign = isUser ? 'flex-end' : 'flex-start';

            return (
              <StyledMessage
                key={id}
                compact
                inverted
                secondary
                color={isUser ? 'teal' : 'grey'}
                alignself={messageAlign}
              >
                {!isUser && (
                  <Label
                    as='span'
                    color={userColors[username]}
                    ribbon='right'
                    style={{ marginBottom: '10px' }}
                  >
                    {username}
                  </Label>
                )}
                <p>{content}</p>
              </StyledMessage>
            );
          })}
      </ReversedContainer>
    </StyledContainer>
  );
};

export default Messages;
