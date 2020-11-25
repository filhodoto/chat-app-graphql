import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Segment,
  Header,
  Button,
  Popup,
  List,
  Icon,
  Input,
} from 'semantic-ui-react';
import { DELETE_ALL_MESSAGES, DELETE_ALL_USERS } from '../actions/requests';

const ChatHeader = (props) => {
  const [inputContent, setInputContent] = useState('');
  const [deleteAllUsers] = useMutation(DELETE_ALL_USERS);
  const [deleteAllMessages] = useMutation(DELETE_ALL_MESSAGES);
  const { loggedUser, callbackFunc } = props;

  // Handle Add User action
  const handleAddUser = (ev) => {
    ev.preventDefault();
    callbackFunc(inputContent);
    setInputContent('');
  };

  // Handle Input change
  const handleInputChange = (ev, value) => setInputContent(value.value);

  return (
    <Segment
      attached='top'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Header size='medium' style={{ margin: 0 }}>
        <Icon name='comment outline' size='large' />
        {loggedUser && (
          <Header.Content>Logged in as {loggedUser}</Header.Content>
        )}
      </Header>
      <List horizontal>
        <List.Item>
          <Input
            action={<Button onClick={handleAddUser} icon='user add' />}
            size='mini'
            placeholder='Add user...'
            value={inputContent}
            onChange={handleInputChange}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter' && inputContent.length > 0) {
                handleAddUser(ev);
              }
            }}
          />
        </List.Item>
        <List.Item>
          <Button.Group basic size='tiny'>
            <Popup
              trigger={<Button icon='user delete' onClick={deleteAllUsers} />}
              size='mini'
              content='Delete users'
              position='bottom center'
            />
            <Popup
              trigger={
                <Button
                  icon='trash alternate outline'
                  onClick={deleteAllMessages}
                />
              }
              size='mini'
              content='Delete messages'
              position='bottom center'
            />
          </Button.Group>
        </List.Item>
      </List>
    </Segment>
  );
};

export default ChatHeader;
