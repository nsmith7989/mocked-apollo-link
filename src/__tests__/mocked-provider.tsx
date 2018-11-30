import React from 'react';
import { render, waitForElement, wait } from 'react-testing-library';
import { makeMockLink } from '../make-mock-link';
import { MockedProvider } from '../mocked-provider';

import { introspectionResult } from '../test-support/introspection-result';
import { Posts } from '../test-support/Posts';

const mocks = {
  Query() {
    return {
      posts: () => [{ id: 1, title: 'First Post' }],
    };
  },
};

function renderWithContext(ui: React.ReactNode) {
  const MockLink = makeMockLink({ introspectedSchema: introspectionResult, mocks });
  return render(<MockedProvider link={new MockLink()}>{ui}</MockedProvider>);
}

test('renders out a list of posts', async () => {
  const { getByText } = renderWithContext(<Posts />);
  await waitForElement(() => getByText(/first post/i));
});
