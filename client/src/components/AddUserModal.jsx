import React, { useState } from 'react';
import { Button, Form, Header, Icon, Input, Modal } from 'semantic-ui-react';

const AddUserModal = (props) => {
  const [inputContent, setInputContent] = useState('');

  // Handle Submit
  const handleSubmitEvent = (ev) => {
    ev.preventDefault();
    props.callbackFunc(inputContent);
  };

  // Handle Input change
  const handleInputChange = (ev, value) => setInputContent(value.value);

  return (
    <Modal
      basic
      dimmer='blurring'
      open={props.modalOpen}
      size='small'
      style={{ textAlign: 'center' }}
    >
      <Modal.Content>
        <Header icon>
          <Icon name='user times' />
          There are no users online
        </Header>
        <Form
          onSubmit={handleSubmitEvent}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              handleSubmitEvent;
            }
          }}
        >
          <Input
            action={
              <Button
                type='submit'
                icon='user add'
                disabled={inputContent.length === 0}
              />
            }
            type='text'
            placeholder='Add username...'
            value={inputContent}
            onChange={handleInputChange}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddUserModal;
