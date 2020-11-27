import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Dropdown, Form, Icon, Input } from 'semantic-ui-react';
import { SEND_MESSAGES } from '../actions/requests';
import styled from 'styled-components';

const StyledDropdown = styled(Dropdown)`
  padding: 0 20px 0 0;
  display: flex !important;
  align-items: center;
`;

const ChatFooter = ({ usersList, loggedUser, handleUserChange }) => {
  const [message, setMessage] = useState('');
  const [postMessage] = useMutation(SEND_MESSAGES);

  // Handle form submit
  const handleFormSubmit = (ev) => {
    ev.preventDefault();

    if (message.length > 0) {
      // Send message
      postMessage({
        variables: {
          username: loggedUser,
          content: message,
        },
      });
      // Clear state messageContent
      setMessage('');
    }
  };

  // Handle Input change
  const handleInputChange = (ev, value) => setMessage(value.value);

  return (
    <Form
      css='padding: 20px 0 0'
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
        value={message}
        onChange={handleInputChange}
      >
        <StyledDropdown
          trigger={
            <span>
              <Icon name='user' /> {loggedUser}
            </span>
          }
        >
          <Dropdown.Menu>
            <Dropdown.Header content='Choose an user' />
            <Dropdown.Divider />
            {usersList.map((user) => (
              <Dropdown.Item
                onClick={(ev, value) => handleUserChange(ev, value)}
                key={user.key}
                text={user.text}
                {...user}
              />
            ))}
          </Dropdown.Menu>
        </StyledDropdown>
        <input />

        <Button type='submit' icon labelPosition='left' color='teal'>
          <Icon name='send' />
          Send
        </Button>
      </Input>
    </Form>
  );
};

export default ChatFooter;
