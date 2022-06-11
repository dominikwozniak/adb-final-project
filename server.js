const { gql } = require('apollo-server')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const http = require('http')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const typeDefs = gql`
    type Weather {
        id: Int
        city: String
        tempAvg: Float
        tempMin: Float
        tempMax: Float
        date: String
        timestamp: Float
        description: String
    }
    type Query {
        getWeatherFiltered(city: String, condition: String, tempAvg: Float, tempMin: Float, tempMax: Float, before: String, after: String): [Weather]
    }
`

const resolvers = {
    Query: {
        getWeatherFiltered: async (_, { city, condition, tempAvg, tempMin, tempMax, before, after }) => {
            const filters = {}

            if (before) {
                filters['date'] = {
                    ...filters['date'],
                    lte: new Date(before)
                }
            }

            if (after) {
                filters['date'] = {
                    ...filters['date'],
                    gte: new Date(after)
                }
            }

            if (condition) {
                filters['description'] = {
                    contains: condition,
                    mode: 'insensitive',
                }
            }

            if (tempAvg) {
                filters['tempAvg'] = {
                    gte: tempAvg,
                }
            }

            if (tempMin) {
                filters['tempMin'] = {
                    gte: tempMin,
                }
            }

            if (tempMax) {
                filters['tempMax'] = {
                    gte: tempMax,
                }
            }

            return await prisma.observation.findMany({
                where: {
                    city: {
                        contains: city,
                        mode: 'insensitive',
                    },
                    ...filters
                }
            })
        },
    }
}

async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: (ctx) => {
            return ctx
        },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    server.applyMiddleware({
        app
    });

    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)
    .catch((err) => {
        console.error(err)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
