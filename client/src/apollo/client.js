import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     watchQuery: {
    //         fetchPolicy: 'no-cache',
    //         errorPolicy: 'ignore',
    //     },
    //     query: {
    //         fetchPolicy: 'no-cache',
    //         errorPolicy: 'all',
    //     },
    //     mutate: {
    //         fetchPolicy: 'no-cache',
    //     },
    // },
})

export default client
