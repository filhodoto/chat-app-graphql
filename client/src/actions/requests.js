import { gql } from '@apollo/client';

// We use gql so we can write queries like in the server
export const GET_MESSAGES = gql`
  query {
    messages {
      id
      username
      content
    }
  }
`;

export const SEND_MESSAGES = gql`
  mutation($username: String!, $content: String!) {
    postMessage(username: $username, content: $content)
  }
`;
