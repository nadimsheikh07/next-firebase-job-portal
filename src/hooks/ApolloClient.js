// src/ApolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const AplClient = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
});

export default AplClient;
