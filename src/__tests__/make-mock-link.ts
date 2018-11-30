import { introspectionResult } from '../test-support/introspection-result';
import { execute } from 'apollo-link';
import { makeMockLink } from '../make-mock-link';
import waitFor from 'wait-for-observables';
import gql from 'graphql-tag';
import { MockList } from 'graphql-tools';

const query = gql`
  {
    posts {
      id
      title
    }
  }
`;

async function setup(mocks = {}) {
  const MockLink = makeMockLink({ introspectedSchema: introspectionResult, mocks });

  const [{ values }] = (await waitFor(execute(new MockLink(), { query }))) as any;
  return values[0];
}

test('mocks objects based on passed schema', async () => {
  const firstValue = await setup();

  expect(firstValue.data.posts).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
      }),
    ])
  );
});

test('uses custom mocks if provided', async () => {
  const mocks = {
    Post() {
      return {
        id: 1,
        title: 'Custom title',
      };
    },
  };
  const firstValue = await setup(mocks);
  expect(firstValue.data.posts).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: 1,
        title: 'Custom title',
      }),
    ])
  );
});

test('can use custom array length using mock list', async () => {
  const mockLength = 4;
  const mocks = {
    Query() {
      return {
        posts: () => new MockList(mockLength),
      };
    },
  };
  const firstValue = await setup(mocks);
  const posts = firstValue.data.posts;

  expect(posts.length).toBe(mockLength);
});
