import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Dropdown, Form, Icon, Input } from 'semantic-ui-react';
import { SEND_MESSAGES } from '../actions/requests';

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
        value={message}
        onChange={handleInputChange}
      >
        <Dropdown
          item
          trigger={
            <span>
              <Icon name='user' /> {loggedUser}
            </span>
          }
          style={{
            padding: '0 20px 0 0',
            display: 'flex',
            alignItems: 'center',
          }}
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
        </Dropdown>
        <input />

        <Button type='submit' basic icon labelPosition='left' color='blue'>
          <Icon name='send' />
          Send
        </Button>
      </Input>
    </Form>
  );
};

export default ChatFooter;
