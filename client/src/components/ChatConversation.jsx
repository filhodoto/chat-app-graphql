import React from 'react';
import { Segment } from 'semantic-ui-react';
import Messages from './Messages';

const ChatConversation = (props) => {
  return (
    <Segment
      placeholder
      attached
      style={{
        overflow: 'hidden',
      }}
    >
      {props.loggedUser && <Messages {...props} />}
    </Segment>
  );
};

export default ChatConversation;
