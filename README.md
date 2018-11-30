# mocked-apollo-link

Using graphql-tools `addMockFunctionsToSchema` quickly generate schema mocks for rapid development or testing. Useful if you have a large schema or quries and only care about mocking parts.

### Inspriation

- [React Apollo has a mocked link implementation](https://www.apollographql.com/docs/react/recipes/testing.html#MockedProvider), but that requires manual creation of mocks.

- LevelUpTuts had a [video demonstrating how `MockedProvider` can be used with to genearte mocks based on a local schema](https://www.youtube.com/watch?v=OCBWsscJFEQ)

This takes the mocking concept one step further by combining the two techniques and using `addMockFunctionsToSchema` to get mocking working quickly.

### Testing Example

Given the schema:

```graphql
type Author {
  name: String!
  id: Int!
  bio: String!
}

type Query {
  authors: [Author]
}
```

```javascript
// AuthorList.js
import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_ALL_AUTHORS = gql`
  query GET_ALL_AUTHORS {
    authors {
      name
      id
    }
  }
`;

export default class AuthorsList extends React.Component {
  render() {
    return (
      <Query query={GET_ALL_AUTHORS}>
        {({ data, loading, error }) => {
          if (loading) {
            return 'loading...';
          }
          if (error) {
            return `Error ${error}`;
          }

          return data.authors.map(author => <a key={author.id}>{author.name}</a>);
        }}
      </Query>
    );
  }
}
```

```javascript
// __tests__/Component.js
import React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { makeMockLink, MockedProvider } from 'mocked-apollo-link';

// run an introspection query and save the results someplace
import introspectionResult from 'test-support/introspectedResult.json';

import AuthorList from '../AuthorList';

const defaultMocks = {
  author() {
    return {
      id: 1,
      name: 'Charles Dickens',
    };
  },
};

function renderWithContext(ui, mocks = defaultMocks) {
  const MockLink = makeMockLink({ introspectedSchema: introspectionResult, mocks });
  return render(<MockedProvider link={new MockLink()}>{ui}</MockedProvider>);
}

test('Renders out a list of authors', async () => {
  const { getByText } = renderWithContext(<AuthorList />);

  // wait for element to be on the page
  // this will skip the loading state
  await waitForElement(() => getByText(/charles dickens/));
});
```
