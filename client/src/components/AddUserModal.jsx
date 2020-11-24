import React, { useState } from 'react';
import { Button, Form, Header, Input, Modal } from 'semantic-ui-react';

const AddUserModal = (props) => {
  const [inputContent, setInputContent] = useState('');

  // Handle Input change
  const handleSubmitEvent = (ev, value) => {
    ev.preventDefault();
    props.callbackFunc(inputContent);
  };

  // Handle Input change
  const handleInputChange = (ev, value) => setInputContent(value.value);

  return (
    <Modal basic dimmer='blurring' open={props.modalOpen} size='small'>
      <Modal.Content>
        <Modal.Description>
          <Header>There are no users to chat</Header>
          <Form
            onSubmit={handleSubmitEvent}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                handleSubmitEvent;
              }
            }}
          >
            <Input
              type='text'
              placeholder='Insert username...'
              value={inputContent}
              onChange={handleInputChange}
              action
            >
              <input />
              <Button
                type='submit'
                icon='user add'
                content='Add user'
                disabled={inputContent.length === 0}
              />
            </Input>
          </Form>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default AddUserModal;
