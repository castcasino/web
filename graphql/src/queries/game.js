/* Import types. */
// import GameType from '../types/Game.js'

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
} from 'graphql'

export default {
    type: new GraphQLList(GraphQLString),
    args: {
        gameid: {
            type: new GraphQLList(GraphQLString),
            description: `Enter a __Game ID__ string.`,
        },
    },
    resolve: (_root, args, ctx) => {
        console.log('Game (args):', args)

        return [{
            field1: 'This is a GAME asset!',
            field2: 1337,
            field3: 88888888,
        }]
    },
    description: `Game description goes here.`,
}
