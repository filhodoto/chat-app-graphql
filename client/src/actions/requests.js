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
