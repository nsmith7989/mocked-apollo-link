import { ApolloLink, Observable, Operation } from 'apollo-link';
import { addMockFunctionsToSchema, IMocks } from 'graphql-tools';
import { print, graphql, buildClientSchema } from 'graphql';

interface MakeMockLinkOptions {
  introspectedSchema: any;
  mocks?: IMocks;
}

export function makeMockLink({ introspectedSchema, mocks }: MakeMockLinkOptions) {
  const schema = buildClientSchema(introspectedSchema);

  addMockFunctionsToSchema({
    schema,
    mocks: mocks,
  });

  return class MockedLink extends ApolloLink {
    public request(operation: Operation) {
      return new Observable(observer => {
        const query = operation.query;

        graphql(schema, print(query), null, operation.getContext(), operation.variables)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
            observer.complete();
          });
      });
    }
  };
}
