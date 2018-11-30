import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_ALL_POSTS = gql`
  query GET_ALL_POSTS {
    posts {
      id
      title
    }
  }
`;

export class Posts extends React.Component {
  public render() {
    return (
      <Query query={GET_ALL_POSTS}>
        {({ data, loading, error }) => {
          if (loading) {
            return 'loading...';
          }
          if (error) {
            return `Error ${error}`;
          }

          return data.posts.map((post: any) => <a key={post.id}>{post.title}</a>);
        }}
      </Query>
    );
  }
}
