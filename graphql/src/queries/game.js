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
    // args: {
    //     fieldName: {
    //         type: new GraphQLList(GraphQLString),
    //         description: `Field description goes here.`,
    //     },
    // },
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
