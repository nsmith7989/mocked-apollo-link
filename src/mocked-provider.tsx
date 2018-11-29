import * as React from 'react';

import { ApolloLink } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { DefaultOptions } from 'apollo-client/ApolloClient';
import { InMemoryCache as Cache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { ApolloCache } from 'apollo-cache';

interface MockedProviderProps<T = {}> {
  defaultOptions?: DefaultOptions;
  cache?: ApolloCache<T>;
  link: ApolloLink;
  children: React.ReactNode;
}

interface MockedProviderState {
  client: ApolloClient<any>;
}

export class MockedProvider extends React.Component<MockedProviderProps, MockedProviderState> {
  constructor(props: MockedProviderProps) {
    super(props);
    const { cache, defaultOptions, link } = props;

    const client = new ApolloClient({
      cache: cache || new Cache({ addTypename: true }),
      defaultOptions,
      link: link,
    });

    this.state = { client };
  }

  public render() {
    return <ApolloProvider client={this.state.client}>{this.props.children}</ApolloProvider>;
  }

  // deal with clean up
  public componentWillUnmount() {
    if (!this.state.client.queryManager) {
      return;
    }
    const scheduler = this.state.client.queryManager.scheduler;
    // cleanup polling
    Object.keys(scheduler.registeredQueries).forEach(id => scheduler.stopPollingQuery(id));
    // cleanup interval
    Object.keys(scheduler.intervalQueries).forEach((id: any) => scheduler.fetchQueriesOnInterval(id));
  }
}
