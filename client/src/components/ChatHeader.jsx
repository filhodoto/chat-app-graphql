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
import styled from 'styled-components';

const StyledButtonGroup = styled(Button.Group)`
  .ui.icon.button:hover {
    color: teal !important;
  }
`;

const StyledContainer = styled(Segment)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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
    <StyledContainer attached='top'>
      <Header size='medium' style={{ margin: 0 }} color='teal'>
        <Icon name='comment outline' size='large' />
        {loggedUser && (
          <Header.Content>Logged in as {loggedUser}</Header.Content>
        )}
      </Header>
      <List horizontal>
        <List.Item>
          <Input
            action={
              <Button onClick={handleAddUser} icon='user add' color='teal' />
            }
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
          <StyledButtonGroup basic size='tiny'>
            <Popup
              trigger={
                <Button
                  icon='user delete'
                  onClick={() => {
                    deleteAllUsers();
                    deleteAllMessages();
                  }}
                />
              }
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
          </StyledButtonGroup>
        </List.Item>
      </List>
    </StyledContainer>
  );
};

export default ChatHeader;
