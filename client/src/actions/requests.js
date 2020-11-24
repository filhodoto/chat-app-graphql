import { gql } from '@apollo/client';

// We use gql so we can write queries like in the server
export const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      username
      content
    }
  }
`;

export const GET_USERS = gql`
  query {
    users {
      username
      key
      text
    }
  }
`;

export const SEND_MESSAGES = gql`
  mutation($username: String!, $content: String!) {
    postMessage(username: $username, content: $content)
  }
`;

export const ADD_USER = gql`
  mutation($username: String!) {
    addUser(username: $username)
  }
`;

export const DELETE_ALL_USERS = gql`
  mutation {
    deleteAllUsers
  }
`;
export const DELETE_ALL_MESSAGES = gql`
  mutation {
    deleteAllMessages
  }
`;
